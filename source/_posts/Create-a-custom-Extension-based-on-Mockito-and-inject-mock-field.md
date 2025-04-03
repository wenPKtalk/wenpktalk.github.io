---
title: Create a custom Extension based on Mockito and inject mock field
date: 2025-04-03 22:17:41
tags: [Mockito, Junit]
---

# 背景
> 在Spring 使用注入依赖bean的时候，可能既有使用@Autowired 的字段注入，也可能使用构造器注入。如此场景，在写单元测试的时候使用@Mock的Field就是null了。这是由于Mockito初始化@InjectMocks的被
> 测试对象时的策略会采用合适的构造器进行实例化，着用@Mock的Field在使用时就是null.

# 示例代码

OldService.java

```java
@Service
@RequiredArgsConstructor
public class OldService {
 
  @Autowired
  private OldService2 oldService;
 
  //add new dependency bean
  private final NewService newService; 

  public void save(SomeObject someObj) {
    SomeObject newObject = oldService.handleSome(someObj);
    newService.save(newObject);
  }
}
```
OldServiceTest.java

```java
@ExtendWith(MockitoExtension.class)
public class OldServiceTest {
  @InjectMocks
  private OldService oldService;
 
  @Mock
  private OldService2 oldService;

  @Mock
  private NewService newService;

  @Test
  void should_save_but_oldService_will_NPE(){
    //will NPE
    when(oldService.handleSome(someObj)).thenReturn(newObject)
  }

}

```


# 解决方案
自定义CustomInjectionExtension.java 处理字段注入的mock

```java
    import org.junit.jupiter.api.extension.BeforeEachCallback;
    import org.junit.jupiter.api.extension.ExtensionContext;
    import org.mockito.InjectMocks;
    import org.mockito.Mock;
    import org.mockito.Mockito;
    import org.mockito.Spy;
    import java.lang.reflect.Constructor;
    import java.lang.reflect.Field;
    import java.lang.reflect.Parameter;
    import java.util.*;
    
    
    /**
     * JUnit 5 extension that enhances Mockito's dependency injection capabilities.
     * This extension locates fields annotated with @InjectMocks and injects @Mock/@Spy objects
     * into them, handling null instances and constructor injection automatically.
     */
    public class CustomInjectionExtension implements BeforeEachCallback {
    
        @Override
        public void beforeEach(ExtensionContext context) throws Exception {
            Object testInstance = context.getRequiredTestInstance();
    
            // Find and process the field with @InjectMocks annotation
            Field injectMocksField = findInjectMocksField(testInstance);
            Object injectMocksInstance = getOrCreateInjectMocksInstance(testInstance, injectMocksField);
    
            // Perform dependency injection
            injectDependencies(testInstance, injectMocksInstance, injectMocksField.getType());
        }
    
        /**
         * Finds the field annotated with @InjectMocks in the test class.
         *
         * @param testInstance the test class instance
         * @return the field annotated with @InjectMocks
         * @throws RuntimeException if no field with @InjectMocks is found
         */
        private Field findInjectMocksField(Object testInstance) {
            return Arrays.stream(testInstance.getClass().getDeclaredFields())
                    .filter(field -> field.isAnnotationPresent(InjectMocks.class))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No @InjectMocks annotation found in test class"));
        }
    
        /**
         * Gets the existing @InjectMocks instance or creates a new one if null.
         *
         * @param testInstance the test class instance
         * @param injectMocksField the field annotated with @InjectMocks
         * @return the instance of the class to inject mocks into
         * @throws Exception if instance creation fails
         */
        private Object getOrCreateInjectMocksInstance(Object testInstance, Field injectMocksField) throws Exception {
            injectMocksField.setAccessible(true);
            Object injectMocksInstance = injectMocksField.get(testInstance);
    
            if (injectMocksInstance == null) {
                Map<Class<?>, Object> mocksByType = collectMockObjects(testInstance);
                injectMocksInstance = createInstanceViaConstructor(injectMocksField.getType(), mocksByType);
                injectMocksField.set(testInstance, injectMocksInstance);
            }
    
            return injectMocksInstance;
        }
    
        /**
         * Collects all mock objects from the test class instance.
         *
         * @param testInstance the test class instance
         * @return map of mock objects by their type
         * @throws IllegalAccessException if field access fails
         */
        private Map<Class<?>, Object> collectMockObjects(Object testInstance) throws IllegalAccessException {
            Map<Class<?>, Object> mocksByType = new HashMap<>();
    
            for (Field field : testInstance.getClass().getDeclaredFields()) {
                if (field.isAnnotationPresent(Mock.class) || field.isAnnotationPresent(Spy.class)) {
                    field.setAccessible(true);
                    Object mockObject = field.get(testInstance);
    
                    // Create mock object if null
                    if (mockObject == null) {
                        mockObject = createMockObject(field);
                        field.set(testInstance, mockObject);
                    }
    
                    mocksByType.put(field.getType(), mockObject);
                }
            }
    
            return mocksByType;
        }
    
        /**
         * Creates a mock or spy object based on field annotations.
         *
         * @param field the field to create a mock for
         * @return created mock or spy object
         */
        private Object createMockObject(Field field) {
            if (field.isAnnotationPresent(Mock.class)) {
                return Mockito.mock(field.getType());
            } else {
                return Mockito.spy(field.getType());
            }
        }
    
        /**
         * Creates an instance of the target class by finding and using an appropriate constructor.
         *
         * @param targetClass the class to instantiate
         * @param availableMocks map of available mock objects by type
         * @return the created instance
         * @throws RuntimeException if instance creation fails
         */
        private Object createInstanceViaConstructor(Class<?> targetClass, Map<Class<?>, Object> availableMocks) {
            Constructor<?>[] constructors = targetClass.getDeclaredConstructors();
            Arrays.sort(constructors, (c1, c2) -> c2.getParameterCount() - c1.getParameterCount());
    
            for (Constructor<?> constructor : constructors) {
                constructor.setAccessible(true);
                Object[] constructorArgs = prepareConstructorArguments(constructor, availableMocks);
    
                try {
                    return constructor.newInstance(constructorArgs);
                } catch (Exception e) {
                    // Continue to next constructor if this one fails
                    continue;
                }
            }
    
            throw new RuntimeException(String.format(
                    "Could not instantiate %s. No suitable constructor found that can be called with available mocks.",
                    targetClass.getSimpleName()));
        }
    
        /**
         * Prepares arguments for a constructor by matching parameter types with available mocks.
         *
         * @param constructor the constructor to prepare arguments for
         * @param availableMocks map of available mock objects by type
         * @return array of constructor arguments
         */
        private Object[] prepareConstructorArguments(Constructor<?> constructor, Map<Class<?>, Object> availableMocks) {
            Parameter[] parameters = constructor.getParameters();
            Object[] args = new Object[parameters.length];
    
            for (int i = 0; i < parameters.length; i++) {
                Class<?> paramType = parameters[i].getType();
                args[i] = findOrCreateMockForType(paramType, availableMocks);
            }
    
            return args;
        }
    
        /**
         * Finds an existing mock for the given type or creates a new one.
         *
         * @param requiredType the type to find or create a mock for
         * @param availableMocks map of available mock objects by type
         * @return a mock object compatible with the required type
         */
        private Object findOrCreateMockForType(Class<?> requiredType, Map<Class<?>, Object> availableMocks) {
            // Try exact type match
            Object mock = availableMocks.get(requiredType);
            if (mock != null) {
                return mock;
            }
    
            // Try assignable types (interfaces, superclasses)
            mock = availableMocks.entrySet().stream()
                    .filter(entry -> requiredType.isAssignableFrom(entry.getKey()))
                    .map(Map.Entry::getValue)
                    .findFirst()
                    .orElse(null);
    
            if (mock != null) {
                return mock;
            }
    
            // Create new mock if no match found
            mock = Mockito.mock(requiredType);
            availableMocks.put(requiredType, mock);
            return mock;
        }
    
        /**
         * Injects mock dependencies into the target instance.
         *
         * @param testInstance the test class instance
         * @param targetInstance the instance to inject mocks into
         * @param targetClass the class of the target instance
         * @throws Exception if injection fails
         */
        private void injectDependencies(Object testInstance, Object targetInstance, Class<?> targetClass) throws Exception {
            Map<Class<?>, Object> mocksByType = collectMockObjects(testInstance);
    
            for (Map.Entry<Class<?>, Object> entry : mocksByType.entrySet()) {
                Class<?> mockType = entry.getKey();
                Object mockObject = entry.getValue();
    
                injectMockIntoCompatibleFields(targetInstance, mockType, mockObject);
            }
        }
    
        /**
     * Injects a mock object into all compatible fields of the target instance.
     *
     * @param targetInstance the instance to inject mocks into
     * @param mockType the type of the mock object
     * @param mockObject the mock object to inject
     * @throws IllegalAccessException if field access fails
     */
    private void injectMockIntoCompatibleFields(Object targetInstance, Class<?> mockType, Object mockObject)
            throws IllegalAccessException {
        Class<?> targetClass = targetInstance.getClass();

        for (Field field : getAllFields(targetClass)) {
            if (isTypeCompatible(field.getType(), mockType)) {
                field.setAccessible(true);
                if (field.get(targetInstance) == null) {
                    field.set(targetInstance, mockObject);
                }
            }
        }
    }

    /**
     * Checks if two types are compatible for injection.
     *
     * @param fieldType the type of the field
     * @param mockType the type of the mock
     * @return true if the types are compatible, false otherwise
     */
    private boolean isTypeCompatible(Class<?> fieldType, Class<?> mockType) {
        return fieldType.isAssignableFrom(mockType) || mockType.isAssignableFrom(fieldType);
    }

    /**
     * Gets all fields from a class and its superclasses.
     *
     * @param clazz the class to get fields from
     * @return array of all fields
     */
    public Field[] getAllFields(Class<?> clazz) {
        List<Field> allFields = new ArrayList<>();
        Class<?> currentClass = clazz;

        while (currentClass != null) {
            allFields.addAll(Arrays.asList(currentClass.getDeclaredFields()));
            currentClass = currentClass.getSuperclass();
        }

        return allFields.toArray(new Field[0]);
    }
}
```

OldServiceTest.java

```java
@ExtendWith({MockitoExtension.class, CustomInjectionExtension.class})
public class OldServiceTest {
  @InjectMocks
  private OldService oldService;
 
  @Mock
  private OldService2 oldService;

  @Mock
  private NewService newService;

  @Test
  void should_save_but_oldService_will_NPE(){
    //will Fixed
    when(oldService.handleSome(someObj)).thenReturn(newObject)
  }

}

```



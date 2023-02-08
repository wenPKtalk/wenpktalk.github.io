---
title: java如何利用Mockito写好单元测试
date: 2022-04-04 23:31:48
tags: Unit Test
categories: Unit Test
---

### 老生常谈之什么是单元测试
1. 单元测试是低级的，专注于软件系统的最小部分。
2. 单元测试是程序员自己使用某种测试框架来编写的。
3. 对于单元测试的期望是运行速度比其它的测试要更快。
[原文参照Martin Fowler博文](https://martinfowler.com/bliki/UnitTest.html)

### Unit Test和TDD的关系

1. TDD中的T到底是不是Unit Test 存争议，有的人说也可以是集成测试。以下是google测试经理的一段话：

   > **段念**：把 TDD 等同于单元测试，认为 TDD 只是“提前写单元测试”这种想法应该是很多不太了解 TDD 的人容易犯的错误吧。如果把 TDD 放到敏捷开发的大背景下，我倒不觉得 TDD 有什么明显的不足，但如果单独考量 TDD 在企业中的实践，TDD 技术本身不关注代码的质量应该是一个明显的问题。应用 TDD 的企业通常需要采用持续的 Code Review 和 Refactory 方法保证通过 TDD 产生的代码的质量。

原文链接：https://www.infoq.cn/article/virtual-panel-tdd/

2. 还有一段话我觉得比较好，下来总结下。
   * TDD 并不是石头里蹦出来的孙悟空，DBC（Design By Contract）可以看作是 TDD 的前身。在 DBC 的观点里，设计应该以规约（Contract）的形势体现，规约定义了被开发对象的行为。
   * TDD 中的 T，在表现形式上是“测试”，但其实，它更应该被理解为“对被实现对象”的行为限定，也就是 DBC 中的规约。
   * “测试”只是用来体现规约的形式。 单元测试通常被定义为“对应用最小组成单位的测试”，它的测试对象通常是函数或是类，在对类的设计和实现应用 TDD 时，为类建立的测试通常与类的单元测试相当类似，因此 TDD 中的 T 往往被误认为是单元测试本身。
   * TDD 中的 T 描述的是规约，是设计的一部分；
   * 其次，TDD 中的 T 并不明确要求 T 对实现代码的覆盖率；
   * 第三，TDD 的 T 的侧重点是“描述被实现对象应该具有的行为”，而不仅仅是“验证该类的行为是否正确”。
   * 第三，TDD 的 T 的侧重点是“描述被实现对象应该具有的行为”，而不仅仅是“验证该类的行为是否正确”。当然，TDD 中的 T 在形式上是测试，在重构中也可以作为被实现对象的行为验证框架。
   * 单元测试、集成测试、系统测试、用户验收测试是基于传统软件开发过程的划分，在传统软件开发观点中，这几类测试不仅意味这测试对象的不同，同样也以为着不同的测试在开发周期中处于不同的位置。但在敏捷开发中，如果继续使用这几个名词，最多也只能保留它们在测试对象方面的含义。对于 TDD 来说（ATDD 和 BDD 可以认为是 TDD 的变体），在不同的测试类别中都可以应用之，唯一的区别在于 T 面向的对象不同。

### 测试框架Mockito 和 PowerMock介绍
1. Mockito可以让你写出优雅、简洁的单元测试代码。Mockito采用了模拟技术，模拟了一些在应用中依赖的复杂对象，从而把测试对象和依赖对象隔离开来。
2. PowerMock是在其他单元测试框架的基础上做了增强。**PowerMock实现了对静态方法、构造方法、私有方法以及final方法的模拟支持等强大功能。** 但是实现方式是通过提供定制的类加载器以及一些字节码篡改技术，会导致部分单元测试用例不会被覆盖率检测工具检测到，所以迫不得已不推荐使用。

### 利用Spring 搭配 Mockito 编写单元测试
1. 如下一个典型的用户service服务。
```java
@Service
public class UserService {
    @Autowired
    private UserDao userDao;

    /*Id 生成器*/
    @Autowired
    private IdGenerator idGenerator;

    /**
     * 配置参数
     */
    @Value("${userService.canModify}")
    private Boolean canModify;

    /**
     * 创建用户
     *
     * @param userCreate 用户创建
     * @return 用户标识
     */
    public Long createUser(UserVO userCreate) {
        // 获取用户标识
        Long userId = userDAO.getIdByName(userCreate.getName());

        // 根据存在处理
        // 根据存在处理: 不存在则创建
        if (Objects.isNull(userId)) {
            userId = idGenerator.next();
            UserDO create = new UserDO();
            create.setId(userId);
            create.setName(userCreate.getName());
            userDAO.create(create);
        }
        // 根据存在处理: 已存在可修改
        else if (Boolean.TRUE.equals(canModify)) {
            UserDO modify = new UserDO();
            modify.setId(userId);
            modify.setName(userCreate.getName());
            userDAO.modify(modify);
        }
        // 根据存在处理: 已存在禁修改
        else {
            throw new UnsupportedOperationException("不支持修改");
        }

        // 返回用户标识
        return userId;
    }
}

```

2. 针对以上service服务在编写单元测试时，针对它的依赖userDao, idGenerator, canModify我们采用stub来预设存根。这样可以保证我们service只测试自己的逻辑。

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
     /** 模拟依赖对象 */
    /** 用户DAO */
    @Mock
    private UserDAO userDAO;
    /** 标识生成器 */
    @Mock
    private IdGenerator idGenerator;

    /** 定义被测对象 */
    /** 用户服务 */
    @InjectMocks
    private UserService userService;
  
  /**
     * 在测试之前
     */
    @Before
    public void beforeTest() {
        // 注入依赖对象
        ReflectionTestUtils.setField(Boolean.class, "canModify", false);
    }
  
  /**
  *测试方法
  *也可以使用 @Display 来标注测试方法名称。保证从测试方法名称中能读懂测试的目的，和简单的上下文。
  * 注意此处的Test引用jupiter提供的注解。不然会有注入的空指针
  */
  @Test  
  void should_createUserWithNew_givenInfo_WhenNotExisted(){
    //given data; stub
    when(userDAO).getIdByName(any()).thenReturn(null);
    Long userId = 1L;
    when(idGenerator).next().thenReturn(userId);
    UserVO userCreate = new UserVo(***,***,***);
    
    //when
    Long acturalUserId = userService.createUser(userCreate);
    
    //then
    assertEquals(userId, acturalUserId);
    // 验证依赖方法
    // 验证依赖方法: userDAO.getByName
   Mockito.verify(userDAO).getIdByName(userCreate.getName());
   // 验证依赖方法: idGenerator.next
   Mockito.verify(idGenerator).next();
   // 验证依赖方法: userDAO.create
   ArgumentCaptor <UserDO> userCreateCaptor = ArgumentCaptor.forClass(UserDO.class);
   Mockito.verify(userDAO).create(userCreateCaptor.capture());
   // 验证依赖对象
   Mockito.verifyNoMoreInteractions(idGenerator, userDAO);
  }
}

@Test
void should_updateUser_givenUser_whenHasExisted(){
  //只需要stub此处修改，然后进行已存在断言
  Long userId = 1L;
  when(userDAO).getIdByName(any()).thenReturn(userId);
  
  //then
  ....
}

@Test
void should_exception_givenInvalid(){
  //then 断言采用Junit 5提供的
  Assert.assertThrows("返回异常不一致",
            UnsupportedOperationException.class, () -> userService.createUser(userCreate))
}

```

### 如何测试Controller

1. 保证Api层的访问状态是成功的
2. 保证入参校验逻辑是可通过的。
3. 与Service测试不同的是我们要启动web服务，所以必须启动spring容器。但是为了可测service服务我们还是利用Stub技术给出预期返回值。
4. 利用Spring 提供的@Import({*****.class}}指定我们容器中需要的类，可以方便的避免容器需要加载所有bean很慢的尴尬。

```java
@WebMvcTest(controllers = UserController.class, useDefaultFilters = false)
@Import({UserController.class,
        AopAutoConfiguration.class,
        DependenceService.class})
@ActiveProfiles("test")
class UserControllerTest extends ControllerBaseTest {
  
  /**
  *利用Import和Autowired可以将真是的bean在运行测试的时候注入进来。会调用真是的方法。
  */
    @Autowired 
    private MockMvc mvc;
  
    @Autowired
    private DependenceService service;
  
    @MockBean
    private UserService service;
  
    @Test
    void should_200_when_create() {
      Long userId = 1L;
      when(service.createUser(any())).thenReturn(userId);
      
      //when
      mvc.perform(MockMvcRequestBuilders.post("/user")
                        .content(jsonString) //given data
                        .header("X-TIME-ZONE", "Asia/Shanghai")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());//then
    }
  
}
```

5. 使用ArgumentCaptor验证代码中间被stub掉方法的参数.

   存在一种情况我们给serviceA中的methodA写单元测试的过程中，发现调用了serviceB的methodB方法，并且为serviceB方法new 了一个ObjectA对象作为调用serviceB.methodB的参数，如下：

   ```java
   public class ServiceA {
     @Autowired
     public ServiceB serviceB
     
     public void methodA() {
       /*
       * 其它业务代码 
       */
       for (i = 0; i < 3; i++ ){
       	ObjectA objA = new ObjectA();
         ObjcetB objB = serviceB.methodB("hello", objA);  
       }
       /*
       * 其它业务代码 
       */
       
     }
   }
   ```

   此时在测试 methodA的时候，需要使用测试替身代替真实的serviceB.methodB(objA);调用，这个时候我们不能使用 Mockito.when(serviceB.methodB(eq("hello"), eq(new ObjectA())))来进行替换，因为new出来的对象是不同的对象所以stub不住。这个时候应该使用使用ArgumentCaptor进行捕获后验证，如下：

   ```java
   ArgumentCaptor<ObjectA> objACaptor = ArgumentCaptor.forClass(ObjectA.class);
   //利用mockito.when().thenReturn()返回多个对象来stub循环中的三方调用
   Mockito.when(serviceB.methodB(eq("hello"), objACaptor.caputre())).thenReturn(objB1, obj2, obj3);
   //然后获取三次captor捕获的三个参数进行验证。
   List<ObjectA> objAs = objACaptor.getValues();
   //验证三次参数
   Assertions.assertEquals(objAs(0), objB1);
   Assertions.assertEquals(objAs(1), objB2);
   Assertions.assertEquals(objAs(2), objB2);
   
   ```

### 相关链接

Java编程技巧之单元测试用例编写流程：https://zhuanlan.zhihu.com/p/371759603

谈一谈单元测试：https://mp.weixin.qq.com/s/ioya1kzdTGPB0oOZ3DUmig








---
title: java如何利用Mockito写好单元测试
date: 2022-04-04 23:31:48
tags: Unit Test
---

### 老生常谈之什么是单元测试
单元测试作为测试驱动开发的关键环节通常具备以下特征：
1. 单元测试是低级的，专注于软件系统的最小部分。
2. 单元测试是程序员自己使用某种测试框架来编写的。
3. 对于单元测试的期望是运行速度比其它的测试要更快。
[原文参照Martin Fowler博文](https://martinfowler.com/bliki/UnitTest.html)

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







---
title: 番茄架构-Tomato Architecture
date: 2023-06-27 23:07:42
tags: [Architecture]
---

> **番茄架构**是遵循**Common Sense Manifesto**的软件架构的一种方法

### Common Sense Manifesto

* 选择适合你的软件的架构而不是流行的的架构： 在盲目追随流行人物的建议之前，要考虑软件最佳实践。
* 不要过度设计： 努力保持简单，而不是过度工程化，试图猜测未来十年的需求。
* 进行研究与开发，选择一项技术并拥抱它，而不是为了可替代性而创建抽象层。
* 确保你的解决方案作为整体工作正常，而不仅仅是单个组件。

### 架构图

![tomato-architecture.png](https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20230628/17_58/tomato-architecture.png)

### 实施指南：

1. ### 按功能进行打包
  将代码按照功能分成不同的包是一种常见的模式，通常会根据技术层次（如 controllers, services, repositories等）进行划分。如果你正在构建一个专注于特定模块或业务能力的微服务，那么这种方法可能是可行的。

  如果你正在构建一个单体应用或者模块化单体应用，强烈建议首先按照功能而非技术层进行划分。

  详细信息请阅读链接: https://phauer.com/2020/package-by-feature/

2. ### “应用核心”独立于交付机制（Web, Scheduler Jobs, CLI）
   应用核心应该公开可以从主方法调用的API。为了实现这一点，“应用核心”不应该依赖于其调用上下文。这意味着“应用核心”不应依赖于任何HTTP/Web层的库。同样，如果你的应用核心被用于定时任务或命令行接口，任何调度逻辑或命令行执行逻辑都不应泄露到应用核心中。

3. ### 将业务逻辑执行与输入源（Web Controllers, Message Listeners, Scheduled Jobs等）分离
   输入源，如Web Controllers, Message Listeners, Scheduled Jobs等，应该是很薄的一层，在提取请求数据后将实际的业务逻辑执行委托给“应用核心”。

比如：

**坏味道：**

```java
@RestController
class CustomerController {
    private final CustomerService customerService;
    
    @PostMapping("/api/customers")
    void createCustomer(@RequestBody Customer customer) {
       if(customerService.existsByEmail(customer.getEmail())) {
           throw new EmailAlreadyInUseException(customer.getEmail());
       }
       customer.setCreateAt(Instant.now());
       customerService.save(customer);
    }
}
```

**纠正：**

```java
@RestController
class CustomerController {
    private final CustomerService customerService;
    
    @PostMapping("/api/customers")
    void createCustomer(@RequestBody Customer customer) {
       customerService.save(customer);
    }
}

@Service
@Transactional
class CustomerService {
   private final CustomerRepository customerRepository;

   void save(Customer customer) {
      if(customerRepository.existsByEmail(customer.getEmail())) {
         throw new EmailAlreadyInUseException(customer.getEmail());
      }
      customer.setCreateAt(Instant.now());
      customerRepository.save(customer);
   }
}
```

采用这种方法，无论你是通过REST API调用还是通过CLI创建一个客户，所有的业务逻辑都会集中在应用核心中。

**坏味道：**

```java
@Component
class OrderProcessingJob {
    private final OrderService orderService;
    
    @Scheduled(cron="0 * * * * *")
    void run() {
       List<Order> orders = orderService.findPendingOrders();
       for(Order order : orders) {
           this.processOrder(order);
       }
    }
    
    private void processOrder(Order order) {
       ...
       ...
    }
}
```

**纠正：**

```java
@Component
class OrderProcessingJob {
   private final OrderService orderService;

   @Scheduled(cron="0 * * * * *")
   void run() {
      List<Order> orders = orderService.findPendingOrders();
      orderService.processOrders(orders);
   }
}

@Service
@Transactional
class OrderService {

   public void processOrders(List<Order> orders) {
       ...
       ...
   }
}
```

采用这种方法，你可以将订单处理逻辑与调度程序解耦，可以在没有通过调度程序触发的情况下独立进行测试。

4. ### 不要让“外部服务集成”对“应用核心”产生太大影响

   从应用核心，我们可能需要与数据库、消息代理或第三方Web服务等进行通信。必须注意的是，业务逻辑执行器不应过度依赖于外部服务集成。

   例如，假设你正在使用Spring Data JPA进行持久化，而你想从CustomerService中使用分页获取客户。

   **坏味道：**

   ```java
   @Service
   @Transactional
   class CustomerService {
      private final CustomerRepository customerRepository;
   
      PagedResult<Customer> getCustomers(Integer pageNo) {
         Pageable pageable = PageRequest.of(pageNo, PAGE_SIZE, Sort.of("name"));
         Page<Customer> cusomersPage = customerRepository.findAll(pageable);
         return convertToPagedResult(cusomersPage);
      }
   }
   ```

   **纠正：**

   ```java
   @Service
   @Transactional
   class CustomerService {
      private final CustomerRepository customerRepository;
   
      PagedResult<Customer> getCustomers(Integer pageNo) {
         return customerRepository.findAll(pageNo);
      }
   }
   
   @Repository
   class JpaCustomerRepository {
   
      PagedResult<Customer> findAll(Integer pageNo) {
         Pageable pageable = PageRequest.of(pageNo, PAGE_SIZE, Sort.of("name"));
         return ...;
      }
   }
   ```

   这种方式下，任何持久化库的修改都只会影响到持久化层。

5. ### 将领域（domain）逻辑处理放在领域对象中

   如果一个方法仅仅影响领域对象中的状态或者是根据领域对象状态计算某些内容的方法，则该方法应该是属于领域对象。

   **坏味道：**

   ```java
   class Cart {
       List<LineItem> items;
   }
   
   @Service
   @Transactional
   class CartService {
   
      CartDTO getCart(UUID cartId) {
         Cart cart = cartRepository.getCart(cartId);
         BigDecimal cartTotal = this.calculateCartTotal(cart);
         ...
      }
      
      private BigDecimal calculateCartTotal(Cart cart) {
         ...
      }
   }
   ```

   **纠正：**

   ```java
   class Cart {
       List<LineItem> items;
   
      public BigDecimal getTotal() {
         ...
      }
   }
   
   @Service
   @Transactional
   class CartService {
   
      CartDTO getCart(UUID cartId) {
         Cart cart = cartRepository.getCart(cartId);
         BigDecimal cartTotal = cart.getTotal();
         ...
      }
   }
   ```

6. ### 不要创建没有必要的接口

   不要创建接口并希望有一天我们可以为此接口添加另一个实现。如果那一天真的到来，那么利用我们现在拥有的强大的 IDE，只需敲击几下键盘即可提取界面。如果创建接口的原因是为了使用 Mock 实现进行测试，我们有像 Mockito 这样的模拟库，它能够在不实现接口的情况下模拟类。

   因此，除非有充分的理由，否则不要创建接口。

7. ### 拥抱框架强大的功能和灵活性

   通常，创建库和框架是为了满足大多数应用程序所需的常见要求。因此，您应该选择一个库/框架来更快地构建应用程序时。

   与其利用所选框架提供的功能和灵活性，不如在所选框架之上创建间接或抽象，并希望有一天您可以将框架切换到其他框架，这通常是一个非常糟糕的主意。

   例如，Spring框架为处理数据库事务、缓存、方法级安全性等提供了声明性支持。引入我们自己的类似注释并通过将实际处理委托给框架来重新实现相同的功能支持是不必要的。

   相反，最好直接使用框架的注释，或者根据需要使用附加语义来组合注释。

   ```java
   @Target(ElementType.TYPE)
   @Retention(RetentionPolicy.RUNTIME)
   @Documented
   @Transactional
   public @interface UseCase {
      @AliasFor(
           annotation = Transactional.class
      )
      Propagation propagation() default Propagation.REQUIRED;
   }
   ```

8. ### 不仅单元测试，也需要集成测试。

   我们绝对应该编写单元测试来测试单元（业务逻辑），如果需要，可以通过模拟外部依赖项。但更重要的是验证整个功能是否正常工作。

   即使我们的单元测试以毫秒为单位运行，我们是否可以放心地投入生产？当然不是。我们应该通过测试实际的外部依赖项（例如数据库或消息代理）来验证整个功能是否正常工作。这让我们更有信心。

   我想知道“我们应该拥有完全独立于外部依赖项的核心域”哲学的整个想法来自于使用真实依赖项进行测试非常具有挑战性或根本不可能的时代。

   幸运的是，我们现在拥有更好的技术（例如：[testcontainer](https://testcontainers.com/) 运行测试时动态启动依赖的中间件容器技术）来测试真正的依赖关系。使用真正的依赖项进行测试可能会花费稍多的时间，但与好处相比，这是一个可以忽略不计的成本。

学习于原文：https://github.com/wenPKtalk/tomato-architecture

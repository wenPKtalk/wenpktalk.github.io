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

1. 按功能进行打包
  将代码按照功能分成不同的包是一种常见的模式，通常会根据技术层次（如 controllers, services, repositories等）进行划分。如果你正在构建一个专注于特定模块或业务能力的微服务，那么这种方法可能是可行的。

  如果你正在构建一个单体应用或者模块化单体应用，强烈建议首先按照功能而非技术层进行划分。

  详细信息请阅读链接: https://phauer.com/2020/package-by-feature/

2. “应用核心”独立于交付机制（Web, Scheduler Jobs, CLI）
   应用核心应该公开可以从主方法调用的API。为了实现这一点，“应用核心”不应该依赖于其调用上下文。这意味着“应用核心”不应依赖于任何HTTP/Web层的库。同样，如果你的应用核心被用于定时任务或命令行接口，任何调度逻辑或命令行执行逻辑都不应泄露到应用核心中。

3. 将业务逻辑执行与输入源（Web Controllers, Message Listeners, Scheduled Jobs等）分离
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

4. 不要让“外部服务集成”对“应用核心”产生太大影响

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

   

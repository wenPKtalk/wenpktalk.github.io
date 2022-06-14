---
title: Java如何断言集合结果集
date: 2022-04-07 10:46:27
tags: Unit Test
categories: Unit Test
---

### 场景

当被测试方法返回结果是集合，我们应该使用哪个断言，如果一个一个元素比较会比较麻烦。所以使用其他包下的断言。

### 代码示例

被测试代码如下，是一组经典的合并两个Map<String, List<Object>>的代码(可以直接使用当成工具方法，注意引入Guava包)：



```java
public Map<String, List<Object>> mergeTwoGroupedMapCollection(Map<String, List<Object>> groupedCollectionOne,
                                                     Map<String, List<Object>> groupedCollectionTwo) {
        Map<String, List<Object>> mapGlobal = Maps.newHashMap();
        mapGlobal.putAll(groupedCollectionOne);
        groupedCollectionTwo.forEach((k, v) -> mapGlobal.merge(k, v, (v1, v2) -> {
            List<Object> data = new ArrayList<>(v1);
            data.addAll(v2);
            return new ArrayList<>(data);
        }));
        return mapGlobal;
    }
```



测试如下：

```java
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;

    @Test
    @DisplayName("should merge multiple map when given two map has grouped by")
    void mergeTwoGroupedMapCollection() {
        MergedCollection mergedCollection = MergedCollection.builder().build();
        Map<String, List<Object>> groupedOne = Maps.newHashMap();
        groupedOne.put("a", Lists.newArrayList("a1", "a2", "a3"));
        groupedOne.put("b", Lists.newArrayList("b1", "b2", "b3"));
        groupedOne.put("c", Lists.newArrayList("c1", "c2", "c3"));

        Map<String, List<Object>> groupedTwo = Maps.newHashMap();
        groupedTwo.put("c", Lists.newArrayList("c3", "c4", "c5", "c6", "c7"));

        Map<String, List<Object>> newGrouped = mergedCollection.mergeTwoGroupedMapCollection(groupedOne, groupedTwo);
        List<Object> except_a = ImmutableList.of("a1", "a2", "a3");
        List<Object> except_b = ImmutableList.of("b1", "b2", "b3");
        List<Object> except_c = ImmutableList.of("c1", "c2", "c3", "c3", "c4", "c5", "c6", "c7");
        assertAll("all elements",
                ()->assertIterableEquals(except_a, newGrouped.get("a")),
                ()->assertIterableEquals(except_b, newGrouped.get("b")),
                ()->assertIterableEquals(except_c, newGrouped.get("c"))
        );
```



### 总结

对于这种工具性的方法，必须添加更小粒度的测试。以便于在重构的时候能够保证代码正确性，和理解上下文逻辑。哪如果是私有方法呢？**测试大于封装**

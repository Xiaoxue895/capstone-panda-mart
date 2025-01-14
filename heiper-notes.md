def find_max_index(arr):

    # 最小值index = 0； 最大值index = 长度-1
    low, high = 0, len(arr) - 1
    
    if arr[low] <= arr[high]:
        return high
    
    while low < high:
        # 先找出中间值
        mid = (low + high) // 2
        
        # 如果中间值大于右侧的值，数组是升序，可能有旋转，那这个时候就返回中间值
        if arr[mid] > arr[mid + 1]:
            return mid
        
        # 如果不是 就要找下方向，更新最大值或最小值的index，找完回到line6
        if arr[mid] < arr[high]:
            high = mid
        else:
            low = mid + 1
    
    # 如果出现最小值最大值重合也返回index
    return low

# 测试用例
print(find_max_index([4, 5, 1, 2, 3]))            # 输出: 1 (值: 5)
print(find_max_index([5, 7, 11, 0, 1, 3]))        # 输出: 2 (值: 11)
print(find_max_index([10, 20, 30, 40, 50]))       # 输出: 4 (值: 50, 未旋转)
print(find_max_index([50, 10, 20, 30, 40]))       # 输出: 0 (值: 50, 旋转1次)
print(find_max_index([20, 30, 40, 50, 10]))       # 输出: 3 (值: 50, 旋转4次)
print(find_max_index([1]))                        # 输出: 0 (值: 1, 单个元素)
print(find_max_index([2, 1]))                     # 输出: 0 (值: 2, 两个元素旋转)
print(find_max_index([3, 4, 5, 1, 2]))            # 输出: 2 (值: 5)



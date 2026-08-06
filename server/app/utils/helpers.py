def adjust_fan_speed(current: float, target: float, delta: float):
    if current < target:
        return min(current + delta, target)
    if current > target:
        return max(current - delta, target)
    return target

export const getTemperatureUnit = (temp: number) => {
    if (temp === 0) {
        return '°C'
    } else {
        return '°F'
    }
}

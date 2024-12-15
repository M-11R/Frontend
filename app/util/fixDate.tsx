export const fixDate = (date: string) => {
    const rawValue = date;
    const formatted = rawValue.replace(/-/g, '').slice(2);
    return formatted;
}
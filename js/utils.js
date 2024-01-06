export const shadeColor = (color, percent) => {
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    r = (Math.min(255, r + Math.round(r * percent / 100))).toString(16).padStart(2, '0');
    g = (Math.min(255, g + Math.round(g * percent / 100))).toString(16).padStart(2, '0');
    b = (Math.min(255, b + Math.round(b * percent / 100))).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
}
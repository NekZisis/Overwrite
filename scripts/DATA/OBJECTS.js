export function createObjects(width, height) {
    const center = width / 2;
    
    return [
        { x: 0, y: 0, width: 20, height: height, material: 'stone' },
        { x: width - 20, y: 0, width: 20, height: height, material: 'stone' },
        { x: 0, y: height - 20, width: width, height: 20, material: 'stone' },
        { x: 0, y: 0, width: width, height: 20, material: 'stone' },
        { x: center - 325, y: 750, width: 650, height: 20, material: 'stone' },
        { x: center - 285, y: 180, width: 35, height: 500, material: 'vines' },
        { x: center + 250, y: 180, width: 35, height: 500, material: 'vines' },
        { x: center - 475, y: 100, width: 50, height: 900, material: 'vines' },
        { x: center + 425, y: 100, width: 50, height: 900, material: 'vines' },
        { x: center + 50, y: 100, width: 100, height: 20, material: 'stone' },
        { x: center - 150, y: 204, width: 100, height: 20, material: 'stone' },
        { x: center + 50, y: 308, width: 100, height: 20, material: 'stone' },
        { x: center - 150, y: 412, width: 100, height: 20, material: 'stone' },
        { x: center + 50, y: 516, width: 100, height: 20, material: 'stone' },
        { x: center - 150, y: 620, width: 100, height: 20, material: 'stone' },
        { x: center - 325, y: height - 200, width: 100, height: 20, material: 'stone' },
        { x: center + 225, y: height - 200, width: 100, height: 20, material: 'stone' },
        { x: 200, y: height - 100, width: 150, height: 20, material: 'stone' },
        { x: 50, y: 500, width: 100, height: 20, material: 'stone' },
        { x: 50, y: height - 190, width: 100, height: 20, material: 'stone' },
        { x: 230, y: height - 450, width: 10, height: 220, material: 'vines' },
        { x: 230, y: height - 450, width: 65, height: 20, material: 'stone' },
        { x: 100, y: 100, width: 20, height: 300, material: 'vines' },
        { x: 250, y: 250, width: 20, height: 250, material: 'vines' },
        { x: 375, y: 320, width: 20, height: 250, material: 'vines' },
        { x: center - 755, y: 100, width: 280, height: 20, material: 'stone' }
    ];
}
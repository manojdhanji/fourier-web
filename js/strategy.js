class OrganicStrategy {
    generate(count) {
        const coeffs = [];
        for (let n = -count; n <= count; n++) {
            if (n === 0) continue;
            const magnitude = Math.random();
            const phase = Math.random() * Math.PI * 2;
            coeffs.push({
                n,
                re: magnitude * Math.cos(phase),
                im: magnitude * Math.sin(phase)
            });
        }
        return coeffs;
    }
} class SmoothStrategy {
    generate(count) {
        const coeffs = [];
        for (let n = -count; n <= count; n++) {
            if (n === 0) continue;
            const magnitude = Math.random() / Math.abs(n);
            const phase = Math.random() * Math.PI * 2;
            coeffs.push({
                n,
                re: magnitude * Math.cos(phase),
                im: magnitude * Math.sin(phase)
            });
        }
        return coeffs;
    }
}

class SparseStrategy {
    constructor(probability = 0.2) {
        this.probability = probability;
    }

    generate(count) {
        const coeffs = [];
        for (let n = -count; n <= count; n++) {
            if (n === 0) continue;
            if (Math.random() < this.probability) {
                const magnitude = Math.random();
                const phase = Math.random() * Math.PI * 2;
                coeffs.push({
                    n,
                    re: magnitude * Math.cos(phase),
                    im: magnitude * Math.sin(phase)
                });
            }
        }
        return coeffs;
    }
}
export const strategies = [
    //new OrganicStrategy(),
    new SmoothStrategy(),
    //new SparseStrategy(0.2)
];


// Item-mode animation juice: screen shake, white flash, particle bursts and
// line-clear fade-outs. Purely cosmetic and self-contained — driven by
// draw_engine (render + explosion detection) and fed by the board managers'
// line-clear hooks. Everything is gated by `enabled`, so puzzle/arcade modes
// are untouched.
class EffectFX {
    constructor() {
        this.enabled = false;
        this.particles = [];   // {x,y,vx,vy,life,maxLife,size,color}
        this.fades = [];       // {px,py,value,life,maxLife}
        this.flash = 0;        // 0..1 white overlay alpha
        this.shake = 0;        // remaining shake magnitude in px
        this.MAX_PARTICLES = 260;
    }

    reset() {
        this.particles.length = 0;
        this.fades.length = 0;
        this.flash = 0;
        this.shake = 0;
    }

    // Cell value -> particle css color. Mirrors the block palette; boom/thunder
    // values (9-17) get bright warm/cool sparks, unknowns fall back to white.
    _color(v) {
        switch (v) {
            case 1: return '#3d7bff'; // blue
            case 2: return '#35d0d0'; // cyan
            case 3: return '#42c74a'; // green
            case 4: return '#d152d1'; // magenta
            case 5: return '#ff922b'; // orange
            case 6: return '#e8443b'; // red
            case 7: return '#f4d63a'; // yellow
            case 9:  return '#ffcc45'; // boom
            case 10: return '#6fb0ff'; // blue boom
            case 11: return '#6fe06f'; // green boom
            case 12: return '#ff5a48'; // red boom
            case 13: return '#ffb043'; // orange boom
            case 14: return '#fff2a0'; // thunder
            case 15: return '#d3d3ff'; // black thunder
            case 16: return '#ffc24a'; // orange thunder
            case 17: return '#ff6a58'; // red thunder
            default: return '#f2f2f2';
        }
    }

    _cellPixel(bx, by) {
        return {
            cx: gStartX + bx * blockSize + blockSize / 2,
            cy: gStartY + by * blockSize + blockSize / 2,
        };
    }

    // Spawn n particles exploding outward from a pixel point.
    _burst(cx, cy, color, n) {
        for (let i = 0; i < n; i++) {
            if (this.particles.length >= this.MAX_PARTICLES) break;
            const ang = Math.random() * Math.PI * 2;
            const spd = blockSize * (0.06 + Math.random() * 0.16);
            const life = 16 + Math.floor(Math.random() * 14);
            this.particles.push({
                x: cx, y: cy,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd - blockSize * 0.05,
                life: life, maxLife: life,
                size: blockSize * (0.12 + Math.random() * 0.14),
                color: color,
            });
        }
    }

    // A full row was cleared: fade every block of the row out and throw sparks.
    onLineClear(y, colors) {
        if (!this.enabled) return;
        for (let x = 0; x < colors.length; x++) {
            const v = colors[x];
            if (!v) continue;
            const { cx, cy } = this._cellPixel(x, y);
            this.fades.push({ px: gStartX + x * blockSize, py: gStartY + y * blockSize,
                              value: v, life: 14, maxLife: 14 });
            this._burst(cx, cy, this._color(v), 4);
        }
        this.shake = Math.min(this.shake + 5, 16);
        this.flash = Math.min(this.flash + 0.45, 1);
    }

    // A boom/thunder effect just started: sparks from every effect cell plus a
    // strong shake/flash. `board` is the current effect snapshot.
    onEffectBurst(board) {
        if (!this.enabled || !board) return;
        let cells = 0;
        for (let y = 0; y < board_height; y++) {
            for (let x = 0; x < board_width; x++) {
                const v = board[y][x];
                if (v >= 9 && v <= 17) {
                    const { cx, cy } = this._cellPixel(x, y);
                    this._burst(cx, cy, this._color(v), 5);
                    cells++;
                }
            }
        }
        if (cells > 0) {
            this.shake = Math.min(this.shake + 9, 18);
            this.flash = Math.min(this.flash + 0.7, 1);
        }
    }

    update() {
        const g = blockSize * 0.014;
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += g;
            p.vx *= 0.98;
            if (--p.life <= 0) this.particles.splice(i, 1);
        }
        for (let i = this.fades.length - 1; i >= 0; i--) {
            if (--this.fades[i].life <= 0) this.fades.splice(i, 1);
        }
        this.flash *= 0.80;
        if (this.flash < 0.02) this.flash = 0;
        this.shake *= 0.80;
        if (this.shake < 0.4) this.shake = 0;
    }

    // Translate the context by a random shake offset. Caller must save/restore.
    applyShake(ctx) {
        if (this.shake <= 0) return;
        const dx = (Math.random() * 2 - 1) * this.shake;
        const dy = (Math.random() * 2 - 1) * this.shake;
        ctx.translate(dx, dy);
    }

    // Draw fading blocks, particles and the flash overlay over the board.
    drawFX(ctx, block_image) {
        // Fading destroyed blocks: shrink + fade toward the cell centre.
        for (const f of this.fades) {
            const t = f.life / f.maxLife;          // 1 -> 0
            const scale = 0.4 + 0.6 * t;
            const s = blockSize * scale;
            const off = (blockSize - s) / 2;
            ctx.globalAlpha = t;
            const img = block_image[f.value];
            if (img) ctx.drawImage(img, f.px + off, f.py + off, s, s);
        }
        // Particles.
        for (const p of this.particles) {
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        // White flash over the play field.
        if (this.flash > 0) {
            ctx.globalAlpha = this.flash * 0.55;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(gStartX, gStartY, board_width * blockSize, board_height * blockSize);
        }
        ctx.globalAlpha = 1.0;
    }
}

let gFX = new EffectFX();

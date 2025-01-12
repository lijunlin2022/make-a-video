import Painter from './paint'
import Parser from './parse'
import { isArray, isString } from './utils/index'
import M from './utils/matrix'
import V from './utils/vector'

const FRAME = window.requestAnimationFrame
const CANCEL = window.cancelAnimationFrame

class DrawPath {
  constructor(canvas, path) {
    this.datas = []
    this.config = { times: 5 }
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')

    if (path) {
      this.setPath(path)
    }
    // 变换
    this.transform = M.create()
  }

  getBoundary() {
    const datas = this.datas
    let l = Infinity
    let r = -Infinity
    let t = Infinity
    let b = -Infinity
    let w = 0
    let h = 0
    let pd
    datas.forEach((v) => {
      pd = v.boundary
      if (pd.r > r) {
        r = pd.r
      }
      if (pd.l < l) {
        l = pd.l
      }
      if (pd.b > b) {
        b = pd.b
      }
      if (pd.t < t) {
        t = pd.t
      }
    })
    w = r - l
    h = b - t
    return {
      l,
      r,
      t,
      b,
      w,
      h,
      cx: l + w / 2,
      cy: t + h / 2,
    }
  }

  asCenter() {
    const canvas = this.canvas
    const sw = canvas.width
    const sh = canvas.height
    const transform = M.create()
    const { w, h, cx, cy } = this.getBoundary()
    const center = [cx, cy]
    const scale = [sw / w, sh / h]
    M.scale(transform, transform, scale)
    V.applyTransform(center, center, transform)
    M.translate(transform, transform, [sw / 2 - center[0], sh / 2 - center[1]])
    this.transform = transform
  }

  clear() {
    const canvas = this.canvas
    const ctx = this.ctx
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    return this
  }

  stop() {
    CANCEL(this.frameId)
    return this
  }

  setSplits(splits) {
    this.stop()
    const datas = this.datas
    datas.forEach((path) => {
      path.points = Parser.points(path.cmds, splits)
      path.runner = Painter.points(path.points)
    })
    return this
  }

  setPath(pathInfo) {
    if (isString(pathInfo)) {
      pathInfo = [pathInfo]
    }
    if (isArray(pathInfo)) {
      this.stop()
      const datas = (this.datas = [])
      let data
      pathInfo.forEach((path) => {
        data = Parser.both(path)
        data.runner = Painter.points(data.points)
        datas.push(data)
      })
    }
    return this
  }

  paintCmds() {
    this.stop()
    const ctx = this.ctx
    const datas = this.datas
    ctx.save()
    ctx.transform(...this.transform)
    datas.forEach(v => Painter.cmds(ctx, v.cmds))
    ctx.restore()
    return this
  }

  paintPoints() {
    this.stop()
    const ctx = this.ctx
    const datas = this.datas
    const times = this.config.times
    const running = new Set()
    datas.forEach((v) => {
      running.add(v.runner)
    })

    let restart = true
    const progresive = () => {
      ctx.save()
      ctx.transform(...this.transform)
      running.forEach((painter) => {
        if (!painter(ctx, times, restart)) {
          running.delete(painter)
        }
      })
      ctx.restore()
      if (running.size > 0) {
        this.frameId = FRAME(progresive.bind(this))
      }
      restart = false
    }
    progresive()
  }
}

export default DrawPath

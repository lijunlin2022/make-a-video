import React, { useEffect, useRef, useState } from 'react'
import { svgPathOfStar } from '../constants/svg-path-of-star'
import DrawPath from '../draw-path'

function drawCanvas({
  drawTool,
  ctx,
  times,
  splitsValue,
  path,
}: {
  drawTool: DrawPath
  ctx: CanvasRenderingContext2D
  times: number
  splitsValue: number
  path: string[]
}) {
  drawTool.clear()
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, 500, 500)
  ctx!.save()
  ctx!.strokeStyle = '#ff0000'
  ctx!.lineWidth = 1
  drawTool.config.times = times
  drawTool.setSplits(splitsValue)
  drawTool.setPath(path)
  drawTool.asCenter()
  drawTool.paintPoints()
  ctx!.restore()
}

const App: React.FC = () => {
  const [path] = useState<string[]>([svgPathOfStar])
  const [times, setTimes] = useState<number>(10)

  const handleTimesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimes(Number(e.target.value))
  }

  const [splitsValue, setSplitsValue] = useState<number>(5)
  const handleSplitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSplitsValue(Number(e.target.value))
  }

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const [chunks, setChunks] = useState<Blob[]>([])

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) {
      return
    }
    ctxRef.current = ctx
    const stream = canvasRef.current.captureStream()
    const recorder = new MediaRecorder(stream)
    recorder.ondataavailable = (e) => {
      setChunks(prev => [...prev, e.data])
    }
    recorderRef.current = recorder
  }, [])

  const startRecording = () => {
    setChunks([])
    drawCanvas({
      drawTool: new DrawPath(canvasRef.current!),
      ctx: ctxRef.current!,
      times,
      splitsValue,
      path,
    })
    recorderRef.current!.start(20)
  }

  const stopRecording = () => {
    recorderRef.current!.stop()
  }

  const downloadVideo = () => {
    const blob = new Blob(chunks, { type: 'video/webm' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'video.webm'
    a.click()
  }

  return (
    <>
      <div className="flex flex-col items-start space-y-4 p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <label className="text-sm">
              <input
                className="border border-gray-300 rounded px-2 py-1"
                value={splitsValue}
                onChange={handleSplitsChange}
              />
              每条命令分割几个点,越多线越平缓光滑,执行速度越慢,距离短的再分割过多会留空...
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm">
              <input
                className="border border-gray-300 rounded px-2 py-1"
                value={times}
                onChange={handleTimesChange}
              />
              每一帧绘制几次,越多绘制越快
            </label>
          </div>
        </div>
      </div>
      <canvas
        className="w-500 h-500 border border-gray-300"
        width="500"
        height="500"
        ref={canvasRef}
      >
      </canvas>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={startRecording}
      >
        开始录制
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={stopRecording}
      >
        停止录制
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={downloadVideo}
      >
        下载视频
      </button>
    </>
  )
}

export default App

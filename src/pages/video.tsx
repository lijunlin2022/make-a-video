import React, { useEffect, useRef, useState } from 'react'

const Video: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const [chunks, setChunks] = useState<Blob[]>([])
  const frameIdRef = useRef<number>(0)

  const draw = (ctx: CanvasRenderingContext2D, x: number, speed: number) => {
    ctx.clearRect(0, 0, 640, 160)
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, 640, 160)
    ctx.beginPath()
    ctx.fillStyle = '#ff0000'
    ctx.arc(x, 80, 10, 0, 2 * Math.PI)
    ctx.fill()
    x += speed
    if (x > 620) {
      x = 20
    }
    frameIdRef.current = requestAnimationFrame(() => draw(ctx, x, speed))
  }

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
    draw(ctxRef.current!, 20, 4)
    recorderRef.current!.start(20)
  }

  const stopRecording = () => {
    cancelAnimationFrame(frameIdRef.current)
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
    <div className="flex flex-col items-center gap-4 p-4">
      <canvas
        ref={canvasRef}
        height={160}
        width={640}
        className="border border-gray-300 rounded shadow-sm"
      >
      </canvas>
      <div className="flex gap-2">
        <button
          onClick={startRecording}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          开始录制（先点）
        </button>
        <button
          onClick={stopRecording}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          停止录像（再点）
        </button>
        <button
          onClick={downloadVideo}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          下载录像
        </button>
      </div>
    </div>
  )
}

export default Video

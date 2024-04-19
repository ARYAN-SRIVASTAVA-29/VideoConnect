import { useSocket } from "@/context/socket"
import { useEffect } from "react"

export default function Home() {
  const socket = useSocket()

  useEffect(() => {
    socket?.on("connect", () => {
      console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
    });
  }, [socket])

  return (
    <h1>Welcome</h1>
  )
}

import { useSocket } from "@/context/socket"
import usePeer from "@/hooks/usePeer"
import { useEffect } from "react"

const Room = () => {
    const socket = useSocket()
    const {peer, myId} = usePeer()
}

export default Room;
import logging from "debug"

const root = logging("debug")


if (typeof window !== "undefined" && window.localStorage){
    const enable =  window.localStorage.getItem("debug")
    if (enable){
        logging.enable(enable)
    }
    
    if (typeof process  !== "undefined" && process.env && process.env.GATSBY_TARGET === "development") {
        logging.enable("debug:*")
    }          
}

export default function getLogger(name){
    return root.extend(name)
}
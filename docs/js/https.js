const LOCAL_DOMAINS=["localhost","127.0.0.1","0.0.0.0"];!LOCAL_DOMAINS.includes(window.location.hostname)&&location.protocol&&"https:"!==location.protocol&&location.replace(`https:${location.href.substring(location.protocol.length)}`);
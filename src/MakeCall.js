
function makeCall(action, requestType, data=null, logging=true) {
    let url = "http://badchess-server.herokuapp.com/" + action;
    if (requestType === "GET") {
        if (logging) {
            console.log(`Making a ${requestType} request to ${action}`);
        }
        return fetch(url, {
            credentials: 'include',
        });
    } else if (requestType === "POST") {
        if (logging) {
            console.log(`Making a ${requestType} request to ${action} with data: ${data}`);
        }
        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: data,
        })
    }
}

export default makeCall
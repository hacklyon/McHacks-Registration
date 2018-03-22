var sendNewMessage;

function onMetaAndEnter(event) {
    if (event.keyCode == 13) {
        sendNewMessage();
        return false;
    }
}
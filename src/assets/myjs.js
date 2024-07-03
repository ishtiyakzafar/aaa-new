
var notificationObj;
// import { environment } from '../environments/environment';

window.parent.clevertap.popupCallback = (notificationData) => {
    notificationObj = notificationData;
};

function submit_pressed() {
    window.parent.clevertap.raisePopupNotificationClicked(notificationObj)
  }

// function Envreturn () {
//     alert(environment.clevertap_Key);
//     return environment;
// }

// Envreturn();

// var MY_JS = () =>{ 
//     const getEnv = function() { return environment }
//     return {
//     getEnv
// }}

// export default MY_JS
const hourHand = [document.querySelector('[hourPAR]'), document.querySelector('[hourNYC]'), document.querySelector('[hourTOK]')];
const minuteHand = [document.querySelector('[minutePAR]'), document.querySelector('[minuteNYC]'), document.querySelector('[minuteTOK]')];
const secondHand = [document.querySelector('[secondPAR]'), document.querySelector('[secondNYC]'), document.querySelector('[secondTOK]')];


function changeTimeZone(date, timeZone) {
    if (typeof date === 'string') {
      return new Date(
        new Date(date).toLocaleString('en-US', {
          timeZone,
        }),
      );
    }
  
    return new Date(
      date.toLocaleString('en-US', {
        timeZone,
      }),
    );
  }

function modulo(x, y){
    if ( x >= 0 ){
        return x%y;
    }
    else{
        return modulo(x+y, y);
    }
}

function setClock(){
    const currentDateTOK = changeTimeZone(new Date(), 'Asia/Tokyo');
    const currentDateNYC = changeTimeZone(new Date(), 'America/New_York');
    const currentDatePAR = changeTimeZone(new Date(), 'Europe/Paris');

    const secondsRatioPAR = currentDatePAR.getSeconds() / 60;
    const minutesRatioPAR = ( secondsRatioPAR + currentDatePAR.getMinutes()) / 60;
    const hoursRatioPAR = ( minutesRatioPAR + currentDatePAR.getHours()) / 12;

    const secondsRatioNYC = currentDateNYC.getSeconds() / 60;
    const minutesRatioNYC = ( secondsRatioNYC + currentDateNYC.getMinutes()) / 60;
    const hoursRatioNYC = ( minutesRatioNYC + currentDateNYC.getHours()) / 12;  
    
    const secondsRatioTOK = currentDateTOK.getSeconds() / 60;
    const minutesRatioTOK = ( secondsRatioTOK + currentDateTOK.getMinutes()) / 60;
    const hoursRatioTOK = ( minutesRatioTOK + currentDateTOK.getHours()) / 12; 

    const PAR_DAY = document.querySelector('[PAR-DAY]');
    const NYC_DAY = document.querySelector('[NYC-DAY]');
    const TOK_DAY = document.querySelector('[TOK-DAY]');

    const PAR_DATE = document.querySelector('[PAR-DATE]');
    const NYC_DATE = document.querySelector('[NYC-DATE]');
    const TOK_DATE = document.querySelector('[TOK-DATE]');


    setRotation(secondHand[0], secondsRatioPAR);
    setRotation(hourHand[0], hoursRatioPAR);
    setRotation(minuteHand[0], minutesRatioPAR);
    let relativeValue = currentDatePAR.getHours();     
    if (relativeValue > 12){
        hourHand[0].setAttribute("am", false);
        PAR_DAY.innerHTML= "P.M";
        PAR_DATE.innerHTML = currentDatePAR.toDateString();
    }else{
        hourHand[0].setAttribute("am", true);
        PAR_DAY.innerHTML = "A.M"
        PAR_DATE.innerHTML = currentDatePAR.toDateString();
    }

    setRotation(secondHand[1], secondsRatioNYC);
    setRotation(hourHand[1], hoursRatioNYC );
    setRotation(minuteHand[1], minutesRatioNYC);  
    relativeValue =  currentDateNYC.getHours();
    if (relativeValue > 12){
        hourHand[1].setAttribute("am", false);
        NYC_DAY.innerHTML = "P.M";
        NYC_DATE.innerHTML = currentDateNYC.toDateString();

    }else{
        hourHand[1].setAttribute("am", true);
        NYC_DAY.innerHTML = "A.M";
        NYC_DATE.innerHTML = currentDateNYC.toDateString();
    }

    setRotation(secondHand[2], secondsRatioTOK);
    setRotation(hourHand[2], hoursRatioTOK);
    setRotation(minuteHand[2], minutesRatioTOK);   
    relativeValue =  currentDateTOK.getHours() ;
    if (relativeValue > 12){
        hourHand[2].setAttribute("am", false)
        TOK_DAY.innerHTML = "P.M";
        TOK_DATE.innerHTML =currentDateTOK.toDateString();
    }else{
        hourHand[2].setAttribute("am", true);
        TOK_DAY.innerHTML = "A.M";
        TOK_DATE.innerHTML = currentDateTOK.toDateString();
    }

}

function setRotation(element, rotationRatio){
    element.style.setProperty('--rotation', rotationRatio * 360);
}

setClock();
setInterval( setClock, 1000);

document.getElementById('submit').addEventListener('onclick', () =>
{
    let request;
    if(window.XMLHttpRequest)
    {
        request = new XMLHttpRequest();
    }
    else
    {
        request = new ActiveXObject('Microsoft.XMLHTTP');
    }
    request.open('POST', 'Server/Login.py', true, 'bruh', 'moment');
    request.send();
});
﻿$(function () {
    var ajaxURL = window.location.protocol+"//"+window.location.hostname+"/"+"twilio-voice-laravel/";
    console.log(ajaxURL);
    var speakerDevices = document.getElementById('speaker-devices');
    var ringtoneDevices = document.getElementById('ringtone-devices');
    var outputVolumeBar = document.getElementById('output-volume');
    var inputVolumeBar = document.getElementById('input-volume');
    var volumeIndicators = document.getElementById('volume-indicators');
    var identity = document.getElementById('nomeUsuarioLogado').value;
    identity = identity.replace(/\s+/g, '');


    document.getElementById('button-call').onclick = function () {
        var phoneNumber =  document.getElementById('phone-number').value;
        phoneNumber = phoneNumber.replace(/\s+/g, '');
        var params = {
          To: phoneNumber,
          outgoing_caller_id : identity
        };

        console.log('Ligando para ' + params.To + '...');
        Twilio.Device.connect(params);

    };


    window.onload = function () {
        if (identity){
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            $.ajax({
                type : "post",
                url : ajaxURL+"token",
                headers: {   'Access-Control-Allow-Origin': '*' },
                dataType : "json",
                data : {
                   identity : identity
                },
                success : function(data){
                    console.log(data.token);
                    Twilio.Device.setup(data.token);

                    Twilio.Device.ready(function (device) {
                        log('Twilio.Device Ready!');
                        document.getElementById('call-controls').style.display = 'block';
                    });

                    Twilio.Device.error(function (error) {
                        log('Twilio.Device Error: ' + error.message);
                    });

                    Twilio.Device.connect(function (conn) {
                        console.log('Successfully established call!');
                        console.log(conn);

                        document.getElementById('button-call').style.display = 'none';
                        document.getElementById('button-hangup').style.display = 'inline';
                        volumeIndicators.style.display = 'block';
                        bindVolumeIndicators(conn);
                    });

                    Twilio.Device.disconnect(function (conn) {
                        console.log('End!');
                        console.log(conn);
                        document.getElementById('button-call').style.display = 'inline';
                        document.getElementById('button-hangup').style.display = 'none';
                        volumeIndicators.style.display = 'none';
                    });

                    Twilio.Device.on('incoming', function(conn) {
                        log('Incoming connection from ' + conn.parameters.From);
                        atualizaStatusDaChamada(conn.parameters, conn.message, 'Incoming');
                        conn.customParameters.forEach((val,key) => {
                            if(key == "outgoing_caller_id"){
                                document.getElementById("dialog-confirm").title = val +  ", está ligando... ";

                            }
                        });

                        $( "#dialog-confirm" ).dialog({
                            resizable: false,
                            height: "auto",
                            width: 400,
                            modal: true,
                            buttons: {
                                "Accept": function() {
                                    conn.accept();
                                    atualizaStatusDaChamada(conn.parameters, conn.message, 'Accepted');
                                },
                                "Reject": function() {
                                    conn.reject();
                                    $( this ).dialog( "close" );
                                    atualizaStatusDaChamada(conn.parameters, conn.message, 'Reject');
                                }
                              }
                        });
                    });

                    setClientNameUI(data.identity);
                    Twilio.Device.audio.on('deviceChange', updateAllDevices);
                      // Show audio selection UI if it is supported by the browser.
                    if (Twilio.Device.audio.isSelectionSupported) {
                        document.getElementById('output-selection').style.display = 'block';
                    }

                },
                error : function(err){
                    console.log(err);

                    alert("err");
                    log('Could not get a token from server!');
                }
            })
        }else {
            alert("Please choose name");
        }
    };

    function atualizaStatusDaChamada(dadosDaChamada, from,  status) {
        $.ajax({
            url : ajaxURL+'calls/create',
            type : "post",
            dataType : "json",
            data : {
                call_sid : dadosDaChamada.CallSid,
                from_user : from.outgoing_caller_id,
                to_user	 : dadosDaChamada.To,
                status : status,
                duration : '0'
            },
            success : function(data){

            },
            error : function(err){
                console.log('Call nao atualizada!');
            }
        })
    }

    document.getElementById('button-hangup').onclick = function () {
        log('Cancelando...');

        Twilio.Device.disconnectAll();
    };

    document.getElementById('get-devices').onclick = function() {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(updateAllDevices);
    };

    speakerDevices.addEventListener('change', function() {
        var selectedDevices = [].slice.call(speakerDevices.children)
          .filter(function(node) { return node.selected; })
          .map(function(node) { return node.getAttribute('data-id'); });

        Twilio.Device.audio.speakerDevices.set(selectedDevices);
    });

    ringtoneDevices.addEventListener('change', function() {
        var selectedDevices = [].slice.call(ringtoneDevices.children)
          .filter(function(node) { return node.selected; })
          .map(function(node) { return node.getAttribute('data-id'); });

        Twilio.Device.audio.ringtoneDevices.set(selectedDevices);
    });

    function bindVolumeIndicators(connection) {
        connection.volume(function(inputVolume, outputVolume) {
          var inputColor = 'red';
          if (inputVolume < .50) {
            inputColor = 'green';
          } else if (inputVolume < .75) {
            inputColor = 'yellow';
          }

          inputVolumeBar.style.width = Math.floor(inputVolume * 300) + 'px';
          inputVolumeBar.style.background = inputColor;

          var outputColor = 'red';
          if (outputVolume < .50) {
            outputColor = 'green';
          } else if (outputVolume < .75) {
            outputColor = 'yellow';
          }

          outputVolumeBar.style.width = Math.floor(outputVolume * 300) + 'px';
          outputVolumeBar.style.background = outputColor;
        });
    }

    function updateAllDevices() {
        updateDevices(speakerDevices, Twilio.Device.audio.speakerDevices.get());
        updateDevices(ringtoneDevices, Twilio.Device.audio.ringtoneDevices.get());
    }
});

function setaClientName(nome) {
   document.getElementById('phone-number').value = nome;
}

// Update the available ringtone and speaker devices
function updateDevices(selectEl, selectedDevices) {
    selectEl.innerHTML = '';
    Twilio.Device.audio.availableOutputDevices.forEach(function(device, id) {
        var isActive = (selectedDevices.size === 0 && id === 'default');
        selectedDevices.forEach(function(device) {
          if (device.deviceId === id) { isActive = true; }
        });

        var option = document.createElement('option');
        option.label = device.label;
        option.setAttribute('data-id', id);
        if (isActive) {
          option.setAttribute('selected', 'selected');
        }
        selectEl.appendChild(option);
    });
}

// Activity log
function log(message) {
    var logDiv = document.getElementById('log');
    logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
    logDiv.scrollTop = logDiv.scrollHeight;
}

// Set the client name in the UI
function setClientNameUI(clientName) {
    var div = document.getElementById('client-name');
    div.innerHTML = 'Identificação: <strong>' + clientName +
    '</strong>';
}

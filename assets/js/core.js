$(function() {

    var base_url='http://'+document.location.hostname, info = [], timer, i = 0;

    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || function(){alert('Su navegador no soporta navigator.getUserMedia().');};

    window.datosVideo = {
        'StreamVideo': null,
        'url' : null
    };

    navigator.getUserMedia({'audio':false, 'video':true}, function(streamVideo){
        datosVideo.StreamVideo = streamVideo;
        datosVideo.url = window.URL.createObjectURL(streamVideo);
        $('#camara').attr('src', datosVideo.url);
        $('.capture').show();
    }, function(){
        alert('No fue posible obtener acceso a la cámara.');
    });

    var c = $('.thumb').length;

    $('#shot').on('click', function(e){
        e.preventDefault();
        var btn = $(this);
        if(btn.is(':visible')){ btn.hide(); }
        timer = setInterval(takePhotos,1300);
        $('div.counter').show();
    });

    $('body').on('click','.scroller ul li a', function(e){
        e.preventDefault();
        var url = $(this).data('url');
        swal({  imageUrl:url, imageSize:'460x368', title:'Lunave', text:'http://lunave.com', confirmButtonText: "Aceptar" });
    });

    loadStream = function(){
        $.ajax({
            type: 'GET',
            url: base_url+'/main/stream',
            beforeSend: function(){
                //$('div.counter').html('Procesando...');
            }
        }).done(function(response) {
            $('.scroller ul').html(response);
             $(".scroller").animate({ scrollTop: $('.scroller ul').height() }, "slow");
        });
    }

    loadStream();

    takePhotos = function(){
        var oCamara, oFoto, oContexto, w, h, span;
        oCamara = $('#camara');
        oFoto = $('#foto');
        w = 460;
        h = 368;
        oFoto.attr({'width': w, 'height': h});
        oContexto = oFoto[0].getContext('2d');
        oContexto.drawImage(oCamara[0], 0, 0, w, h);
        var canvas = document.getElementById('foto');
        var src = canvas.toDataURL('image/png');
        var html = '<img class="h_v_c round" src="'+src+'" border="0" />';
        $(html).appendTo('.thumb:eq('+i+')');
        info[i] = src;
        span = '<span>'+(i+1)+'</span>';
        $('div.counter').html(span);
        i++; 
        if(i==c){ 
            i = 0;
            clearInterval(timer);
            setTimeout(savePhoto,1000);
        }
    }

    savePhoto = function(){
        $.ajax({
            type: 'POST',
            url: base_url+'/main/create',
            data: { 'data': info },
            beforeSend: function(){
                $('div.counter').html('Procesando...');
            }
        }).done(function(response) {
            
            if(response!='error'){
                $('div.counter').hide();
                $('div.counter').html('Prepárate');
                $('.thumb img').remove();
                $('#shot').show();
                swal({  imageUrl:response, imageSize:'460x368', title:'', text: "¡Imagen guardada!", confirmButtonText: "Aceptar" });
                loadStream();
            }

        });
    }

});
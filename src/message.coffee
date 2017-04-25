
message_display = (message) ->
    console.log(message)
    $('#entry-name').text(message['name'])
    if message.hasOwnProperty('completed')
        $('#entry').append(
            $('<span>').append('This item is completable')
        )
        


message_fetch = (id) ->    
    $.get "/api/message/#{id}", (data) ->
        message_display(data)
    







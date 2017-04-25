refresh_timeline = () ->
    $.get '/api/all', (data) ->
      $('#timeline-elements').empty()
      
      inverse = false
      for element in data
        inverse = !inverse
        id = element._id
        if element.hasOwnProperty('completed')
            completed = 'incomplete'
            if element.completed == true
                completed = 'complete'
            $('#timeline-elements').append(
                todo_element(id,inverse,"#{element.name} - (#{completed})",'',element.time)
             )
        else if element.hasOwnProperty('answer')
            $('#timeline-elements').append(
                qa_element(id,inverse,element.name,element.answer,element.time)
            )
        else
            $('#timeline-elements').append(
                message_element(id,inverse,element.name,element.time)
            )

      return



timeline_element = (id,inverted,glyph,title,body,time) ->

        cls = 'timeline-entry'
        if inverted
            cls = 'timeline-entry left-aligned'

        tokens = time.split('T')
        _d = tokens[0]
        _t = tokens[1].split('.')[0]
        return $('<article>').attr({
            'class': cls
        }).append(
            $('<div>').attr({
                'class': 'timeline-entry-inner'
            }).append(

                $('<time>').attr({
                    'class': 'timeline-time',
                    'datetime': time
                }).append(
                    $('<span>').append(_t)
                ).append(
                    $('<span>').append(_d)
                )

            ).append(
                $('<div>').attr({
                    'class': 'timeline-icon bg-success'
                }).append(
                    $('<i>').attr({
                        'class': "glyphicon #{glyph}"
                    })
                )
            ).append(
                $('<div>').attr({
                    'class': 'timeline-label'
                }).append(
                    $('<h2>').append(
                        $('<a>').attr({
                            href:"/page/message/#{id}"}
                        ).append(
                            $('<span>').append("#{title}")
                        )                            
                    )
                ).append(
                    $('<p>').append("#{body}")
                )
            )
)







message_element = (id,inverted,title,time) ->
  return timeline_element(id,inverted,'glyphicon-pencil',title,'',time)

todo_element = (id,inverted,title,body,time) ->
  return timeline_element(id,inverted,'glyphicon-list',title,body,time)

qa_element = (id,inverted,title,body,time) ->
  return timeline_element(id,inverted,'glyphicon-question-sign',title,body,time)



$ ->
        $('#new-qa-action').click (evt) ->
          $.post(   
                    '/api/qa',
                    $('#new-qa-fieldset').serialize()
                ).done (data) ->
                    $('#modal-container-new-question').modal('hide')
                    refresh_timeline()
                    return
          

        $('#new-todo-action').click (evt) ->
          $.post(   
                    '/api/todo',
                    $('#new-todo-fieldset').serialize()
                ).done (data) ->
                    $('#modal-container-new-todo').modal('hide')
                    refresh_timeline()
                    return


        $('#new-message-action').click (evt) ->
          $.post(   
                    '/api/message',
                    $('#new-message-fieldset').serialize()
                ).done (data) ->
                    $('#modal-container-new-message').modal('hide')
                    refresh_timeline()
                    return



        refresh_timeline()


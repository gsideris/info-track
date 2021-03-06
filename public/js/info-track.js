// Generated by CoffeeScript 1.7.1
var message_element, qa_element, refresh_timeline, timeline_element, todo_element;

refresh_timeline = function() {
  return $.get('/api/all', function(data) {
    var completed, element, inverse, _i, _len;
    $('#timeline-elements').empty();
    inverse = false;
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      element = data[_i];
      inverse = !inverse;
      if (element.hasOwnProperty('completed')) {
        completed = 'incomplete';
        if (element.completed === true) {
          completed = 'complete';
        }
        $('#timeline-elements').append(todo_element(inverse, "" + element.name + " - (" + completed + ")", '', element.time));
      } else if (element.hasOwnProperty('answer')) {
        $('#timeline-elements').append(qa_element(inverse, element.name, element.answer, element.time));
      } else {
        $('#timeline-elements').append(message_element(inverse, element.name, element.time));
      }
    }
  });
};

timeline_element = function(inverted, glyph, title, body, time) {
  var cls, id, tokens, _d, _t;
  id = 123;
  cls = 'timeline-entry';
  if (inverted) {
    cls = 'timeline-entry left-aligned';
  }
  tokens = time.split('T');
  _d = tokens[0];
  _t = tokens[1].split('.')[0];
  return $('<article>').attr({
    'class': cls
  }).append($('<div>').attr({
    'class': 'timeline-entry-inner'
  }).append($('<time>').attr({
    'class': 'timeline-time',
    'datetime': time
  }).append($('<span>').append(_t)).append($('<span>').append(_d))).append($('<div>').attr({
    'class': 'timeline-icon bg-success'
  }).append($('<i>').attr({
    'class': "glyphicon " + glyph
  }))).append($('<div>').attr({
    'class': 'timeline-label'
  }).append($('<h2>').append($('<a>').attr({
    href: "/page/entry/" + id
  }).append($('<span>').append("" + title)))).append($('<p>').append("" + body))));
};

message_element = function(inverted, title, time) {
  return timeline_element(inverted, 'glyphicon-pencil', title, '', time);
};

todo_element = function(inverted, title, body, time) {
  return timeline_element(inverted, 'glyphicon-list', title, body, time);
};

qa_element = function(inverted, title, body, time) {
  return timeline_element(inverted, 'glyphicon-question-sign', title, body, time);
};

$(function() {
  $('#new-qa-action').click(function(evt) {
    return $.post('/api/qa', $('#new-qa-fieldset').serialize()).done(function(data) {
      $('#modal-container-new-question').modal('hide');
      refresh_timeline();
    });
  });
  $('#new-todo-action').click(function(evt) {
    return $.post('/api/todo', $('#new-todo-fieldset').serialize()).done(function(data) {
      $('#modal-container-new-todo').modal('hide');
      refresh_timeline();
    });
  });
  $('#new-message-action').click(function(evt) {
    return $.post('/api/message', $('#new-message-fieldset').serialize()).done(function(data) {
      $('#modal-container-new-message').modal('hide');
      refresh_timeline();
    });
  });
  return refresh_timeline();
});

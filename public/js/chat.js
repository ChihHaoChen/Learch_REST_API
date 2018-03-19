var socket = io();

function scrollToBottom() {
  // selectors
  let messages = jQuery('#messages');
  let newMessage = messages.children('li:last-child');
  // heights
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMesaageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMesaageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() {
  console.log(`Connected to the new server.`);
  let params = jQuery.deparam(window.location.search);
  // console.log(`The parameter is ${params.name}`);
  // const userParams = {
  //   name: '5aa5bead6a070f141068ef43',
  //   room: '5aa576547ee1da097beb76b0'
  // };
  // console.log(`the parameter is ${userParams.name}`);
  socket.emit('join', function(err) {
    if (err) {
      alert(err);
      window.location.href = '/chat';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from the server');
});

socket.on('updateUserList', function(users) {
  console.log('Users list', users);
  let ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

socket.on('newMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  // let li = jQuery('<li></li>');
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  //
  // jQuery('#messages').append(li);

  let template = jQuery('#message-template').html();
  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault(); // to prevent the usual operation by copy the input text field into address

  let messageTextBox = jQuery('[name=message]');
  socket.emit(
    'createMessage',
    {
      text: messageTextBox.val()
    },
    function() {
      messageTextBox.val('');
    }
  );
});

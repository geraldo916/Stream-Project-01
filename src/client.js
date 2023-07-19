
// Fetch data from a given URL using an AbortSignal to handle aborting the request
async function fetchData(signal) {
  const response = await fetch('http://127.0.0.1:8000', {
    signal: signal
  });
  const reader = response.body.getReader();

  // Create a ReadableStream to process the response data
  return new ReadableStream({
    async start(controller) {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        controller.enqueue(value);
        await new Promise(resolve => setTimeout(() => resolve(), 50));
      }
    }
  })
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(
      // TransformStream to parse and format the received data
      new TransformStream({
        transform(chunk, controller) {
          for (const item of chunk.split('\n')) {
            try {
              if (!item.length) continue;
              const dataParsed = JSON.parse(item);
              const data = {
                ...dataParsed,
                date: new Date(dataParsed.date).toLocaleDateString()
              };
              controller.enqueue(data);
            } catch (err) {
              // Handle parsing errors if necessary
            }
          }
        }
      })
    );
}

// Event listeners for start and pause buttons
let abortController = new AbortController();
const start = document.getElementById('start');
const pause = document.getElementById('pause');

start.onclick = async function () {
  try {
    // Fetch and process data using the abort signal
    const reader = await fetchData(abortController.signal);
    const listEl = document.querySelector('#data-list');
    var cardCounter = 0;
    var hide = false;
    const consumer = new WritableStream({
      // Write received data to the DOM
      write({ user_id, name, date }, controller) {
        const node = `
          <li id=${cardCounter} class="${hide ? 'hidded' : 'data-item'} ">
             <div> 
                <div class="id_user" >
                <span>Id:</span><h5>${user_id}</h5> 
                </div>
                <div class="name_user" >
                  <span>Name:</span><h3>${name}</h3>
                </div>
            </div>
          </li>
        `;
        if (++cardCounter > 10) {
          hide = true;
        }
        listEl.innerHTML += node;
      },
      abort(reason) {
        console.log("aborted*", reason);
      }
    });

    // Pipe the data from the reader to the consumer
    await reader.pipeTo(consumer, { signal: abortController.signal });
  } catch (error) {
    if (!error.message.includes('abort')) throw error;
  }
};

pause.onclick = function () {
  // Abort the ongoing request and create a new AbortController for future requests
  abortController.abort();
  console.log("Aborting...");
  abortController = new AbortController();
};

// Handle scrolling events
const elFather = document.getElementById('data-list');

elFather.onscroll = function () {
  const viewedElement = document.querySelectorAll('.data-item');
  const viewLength = viewedElement.length;

  const element = document.getElementById(`${viewLength - 11}`);
  var bounding = element.getBoundingClientRect();
  if (bounding.top * (-1) >= 0) {
    // Make the next element visible
    document.getElementById(`${viewLength + 1}`).className = 'data-item';
  } else {
    console.log('Element is visible');
  }
};

import { objectToBuffer, bufferToObject } from "$lib/utils/buffer";
import { demo_data } from "$lib/demo_data";

onmessage = async (e) => {
  let data = await demo_data();
  let return_data = objectToBuffer({ data: data });

  postMessage(return_data);
};

export default {};

import ipfsClient from "ipfs-http-client";
const fs = require("fs");
import console from "console";
import axios from "axios";

const ipfs = ipfsClient({
  protocol: "https",
  host: "staging.api.ipfs.lukso.network",
  port: 443,
});

describe("Staging", () => {
  beforeAll(async () => {
    let responseFromCluster = false;

    while (!responseFromCluster) {
      try {
        const res = await axios.post(
          "https://staging.api.ipfs.lukso.network/api/v0/block/get", {}
        );
      } catch (error) {
        if (error.response.data === 'argument "key" is required\n') {
          responseFromCluster = true;
        }
      }
      await new Promise((r) => setTimeout(r, 5000));
    }
  });

  it("should upload the file", async () => {
    const file = fs.readFileSync("tests/image.jpg");
    const uploadedFile = await ipfs.add({ path: "test-image", content: file });
    console.log(uploadedFile);
    expect(uploadedFile.cid.toString()).toEqual(
      "QmNsB4Cvxp4nL2Bt1irBWDBDWpmFDneQjVzDqfT3SLCjNp"
    );
    expect(uploadedFile.size).toEqual(2572999);
    expect(uploadedFile.path).toEqual("test-image");
  });

  it("should download the file via the gateway", async () => {
    const { headers } = await axios.get(
      "https://staging.ipfs.lukso.network/ipfs/QmNsB4Cvxp4nL2Bt1irBWDBDWpmFDneQjVzDqfT3SLCjNp"
    );

    expect(headers["content-length"]).toEqual("2572370");
  });
});

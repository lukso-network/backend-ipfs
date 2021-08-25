import ipfsClient from "ipfs-http-client";
const fs = require("fs");
import console from "console";
import axios from "axios";

const ipfs = ipfsClient({
  protocol: "https",
  host: "api.ipfs.lukso.network",
  port: 443,
});

describe("Prod", () => {
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
      "https://ipfs.lukso.network/ipfs/QmNsB4Cvxp4nL2Bt1irBWDBDWpmFDneQjVzDqfT3SLCjNp"
    );

    expect(headers["content-length"]).toEqual("2572370");
  });
});

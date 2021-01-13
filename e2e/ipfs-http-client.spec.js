import axios from "axios";
import IpfsHttpClient from "ipfs-http-client";
import fs from "fs";
import path from "path";

let luksoIpfs = IpfsHttpClient({
  protocol: "http",
  host: "146.148.16.48",
  port: 5001,
});

// let infuraIpfs = IpfsHttpClient({
//   host: "localhost",
//   port: 5001,
//   protocol: "http",
// });

describe("ipfs-http-client", () => {
  describe("JSON upload", () => {
    it("can add a JSON file", (done) => {
      luksoIpfs.add({ path: "test.json", content: '{ "test": true }' }).then((result) => {
        expect(result.size).toEqual(24);
        expect(result.path).toEqual("test.json");
        expect(result.cid.toString()).toEqual("QmXJBHmpasaZPFGYNuuYV2LhpBJq2RiT7M2Fvx9FBLJZhK");
        done();
      });
    });

    it("can fetch a JSON file", (done) => {
      const requestJsonFile = axios.get(
        "https://ipfs.lukso.network/ipfs/QmXJBHmpasaZPFGYNuuYV2LhpBJq2RiT7M2Fvx9FBLJZhK"
      );
      requestJsonFile.then((result) => {
        expect(result.data.test).toEqual(true);
        done();
      });
    });
  });

  describe("image upload", () => {
    it("without progress", (done) => {
      const filePath = path.resolve(__dirname, "./image/large-file.jpg");
      const file = fs.readFileSync(filePath);
      luksoIpfs.add({ path: "large-file.jpg", content: file }).then((result) => {
        expect(result.size).toEqual(2572999);
        expect(result.path).toEqual("large-file.jpg");
        expect(result.cid.toString()).toEqual("QmNsB4Cvxp4nL2Bt1irBWDBDWpmFDneQjVzDqfT3SLCjNp");
        done();
      });
    });
  });
});

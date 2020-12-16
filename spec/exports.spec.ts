// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import * as OathOdds from "../src";

describe("exports", () => {
  it("exports the `odds` function", () => {
    expect(OathOdds.rollCampaign).to.exist;
  });
});

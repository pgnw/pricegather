import {afterAll, afterEach, beforeAll, test } from "vitest";
import {server} from "@/lib/__mocks__/node";

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

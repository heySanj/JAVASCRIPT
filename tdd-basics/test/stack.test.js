// Run tests for a script that creates a stack data collection type
class Stack {
    constructor() {
        this.top = -1;
        this.items = {};
    }

    get peek() {
        return this.items[this.top];
    }

    push(value) {
        this.top += 1;
        this.items[this.top] = value
    }

    pop(){
        const value = this.items[this.top]
        delete this.items[this.top]
        this.top -= 1;

        return value
    }
}

describe("My Stack", () => {
    // using .todo will make the test pass while you actually implement the test

    // set up the stack before each test (avoid code duplication)
    // before each is a default Jest function
    let stack;
    beforeEach(() => {
        stack = new Stack();
    });

    it("is created empty", () => {
        expect(stack.top).toBe(-1);
        expect(stack.items).toEqual({}); // toEqual checks for value equality, not the memory location of the value
    });

    it("can push to the top", () => {
        stack.push("🥑");
        expect(stack.top).toBe(0);
        expect(stack.peek).toBe("🥑");
    });

    it("can pop off", () => {
        stack.push("🥑");
        stack.push("🍅");
        stack.push("🍑");

        const item = stack.pop()
        expect(item).toBe("🍑")
        expect(stack.peek).toBe("🍅")
        expect(stack.top).toBe(1)
        expect(stack[2]).toBe(undefined)
    });
});

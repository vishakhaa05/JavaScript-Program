function cancellable(generator) {
    let cancelled = false;   // Track if cancel() was called
    let rejectPromise;       // Reference to reject function of returned promise

    const promise = new Promise((resolve, reject) => {
        rejectPromise = reject;

        function step(nextF, arg) {
            let next;
            try {
                next = nextF.call(generator, arg); // Run generator step
            } catch (e) {
                reject(e); // Generator threw
                return;
            }

            if (next.done) {
                resolve(next.value); // Generator finished successfully
                return;
            }

            // Wait for yielded promise to settle
            next.value.then(
                (val) => {
                    if (cancelled) {
                        // Cancelled after promise resolved
                        try {
                            step(generator.throw, "Cancelled");
                        } catch (err) {
                            reject(err);
                        }
                    } else {
                        step(generator.next, val);
                    }
                },
                (err) => {
                    if (cancelled) {
                        // Cancel overrides rejection
                        try {
                            step(generator.throw, "Cancelled");
                        } catch (err2) {
                            reject(err2);
                        }
                    } else {
                        try {
                            step(generator.throw, err);
                        } catch (e2) {
                            reject(e2);
                        }
                    }
                }
            );
        }

        // Start the generator
        step(generator.next);
    });

    // Cancel function
    function cancel() {
        if (!cancelled) {
            cancelled = true;
            try {
                step(generator.throw, "Cancelled");
            } catch (e) {
                rejectPromise(e);
            }
        }
    }

    return [cancel, promise];
}

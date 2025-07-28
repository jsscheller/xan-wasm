FROM emscripten/emsdk:4.0.6

ENV PATH="/root/.cargo/bin:${PATH}"
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain none && \
    rustup install 1.88.0 && \
    rustup target add wasm32-unknown-emscripten && \
    # Clean up rustup cache
    rm -rf /root/.rustup/tmp

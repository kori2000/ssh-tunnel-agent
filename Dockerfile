FROM balenalib/rpi-raspbian:latest

RUN [ "cross-build-start" ]

RUN set -x \
    # Install ngrok Linux (ARM)
    && apk add --no-cache curl \
    && curl -Lo /ngrok.zip https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-arm.zip \
    && unzip -o /ngrok.zip -d /bin \
    && rm -f /ngrok.zip \
    # Create non-root user.
    && adduser -h /home/ngrok -D -u 6737 ngrok

# Add config script.
COPY --chown=ngrok ngrok.yml /home/ngrok/.ngrok2/

COPY entrypoint.sh /

# Basic sanity check.
RUN su ngrok -c 'ngrok --version'

RUN [ "cross-build-end" ]

USER ngrok

ENV USER=ngrok

EXPOSE 4040

CMD ["/entrypoint.sh"]
FROM balenalib/rpi-raspbian:latest

# Copy Bin Linux (ARM) ngrok
COPY ./bin/ngrok /bin

# Create non-root user.
RUN adduser -h /home/ngrok -D -u 6737 ngrok

# Add config script.
COPY --chown=ngrok ngrok.yml /home/ngrok/.ngrok2/

# Init ngrok config
COPY entrypoint.sh /

# Basic sanity check.
RUN su ngrok -c 'ngrok --version'

USER ngrok

ENV USER=ngrok

EXPOSE 4040

CMD ["/entrypoint.sh"]
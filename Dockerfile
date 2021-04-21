FROM balenalib/rpi-raspbian:latest

# Copy Bin Linux (ARM) ngrok
COPY ./bin/ngrok /bin

# Create non-root user.
#RUN adduser --home /home/ngrok -D -u 6737 ngrok
RUN sudo useradd -d /home/ngrok -m -s/bin/bash -p ngrok

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
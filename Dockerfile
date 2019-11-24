FROM node:10.17-buster-slim as builder

RUN ls

COPY . .

RUN yarn --frozen-lockfile --non-interactive --no-progress

RUN ls -alh node_modules/.bin

RUN yarn generate-proto
RUN yarn build

FROM node:10.17-alpine3.9

COPY --from=builder package.json yarn.lock ./

RUN yarn --frozen-lockfile --non-interactive --no-progress --production

COPY --from=builder proto-dist  ./proto-dist
COPY --from=builder dist  ./dist


ENV DEBUG=*

EXPOSE 50051

ENTRYPOINT ["yarn"]
CMD ["run", "start"]

COPY --from=nightingale:latest /nightingale /nightingale

HEALTHCHECK CMD /nightingale --host 0.0.0.0

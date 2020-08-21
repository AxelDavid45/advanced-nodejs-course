# platziverse-mqtt 

## `agent/connected`
```js
{
  agent: {
    uuid, // auto generated
    username, // defined in configs
    name, // defined in configs
    hostname, // obtained from OS,
    pid // obtained from process
  }
}
```

## `agent/disconnected`
```js
{
  agent: {
    uuid // auto generated
  }
}
```

## `agent/message`
```js
{
  agent, 
  metrics: [
    {
      type,
      value    
    }
  ],
  timestamp // Generate value when saving
}
```


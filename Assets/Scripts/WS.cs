using UnityEngine;
using System.Collections;
using WebSocketSharp;
using System.Threading;

public class WS : MonoBehaviour
{

    public string Server_Addr;
    public string Server_port;

    private WebSocket ws;
    private bool recvFromServer;

    // Use this for initialization
    void Start()
    {
        Debug.Log("Sync Begins");
        recvFromServer = false;
        ws = new WebSocket("ws://" + Server_Addr + ":" + Server_port);
        ws.OnOpen += OnOpenHandler;
        ws.OnMessage += OnMessageHandler;
        ws.OnClose += OnCloseHandler;
        ws.ConnectAsync();
    }

    private void OnOpenHandler(object sender, System.EventArgs e)
    {
        Debug.Log("WebSocket connected!");
        Thread.Sleep(3000);
        ws.SendAsync("Connection established, ready to send hand position data", OnSendComplete);
    }

    private void OnMessageHandler(object sender, MessageEventArgs e)
    {
        Debug.Log("Received From Server :: " + e.Data);
        if (!recvFromServer && e.Data.Length != 0)
            recvFromServer = true;
    }

    private void OnCloseHandler(object sender, CloseEventArgs e)
    {
        Debug.Log("WebSocket closed with reason: " + e.Reason);
    }

    private void OnSendComplete(bool success)
    {

    }

    // Update is called once per frame
    void Update()
    {
        //if (recvFromServer) {
        //	Debug.Log ("sending...");
        //	ws.SendAsync(Random.value + "", OnSendComplete);
        //}
    }

    public void send(string s)
    {
        ws.SendAsync(s, OnSendComplete);
    }
}

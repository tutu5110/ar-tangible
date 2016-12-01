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
        ws = new WebSocket("ws://" + Server_Addr + ":" + Server_port);
        ws.OnOpen += OnOpenHandler;
        ws.OnMessage += OnMessageHandler;
        ws.OnClose += OnCloseHandler;
        ws.Connect();

        // Testing: mock data
        ws.SendAsync("{\"name\":\"bone3\",\"contact\":{\"normal\":{\"x\":0.008832605,\"y\":0.8679793,\"z\":-0.4965217},\"point\":{\"x\":-0.07428741,\"y\":0.1465222,\"z\":-0.1593797},\"separation\":0.008330048},\"impulse\":{},\"relativeVelocity\":{\"x\":-0.01717985,\"y\":0.01998324,\"z\":-0.005812378}}", OnSendComplete);
    }

    private void OnOpenHandler(object sender, System.EventArgs e)
    {
        Debug.Log("WebSocket connected!");
        Thread.Sleep(3000);
        //ws.SendAsync("Connection established, ready to send hand position data", OnSendComplete);
    }

    private void OnMessageHandler(object sender, MessageEventArgs e)
    {
        Debug.Log("Received From Server :: " + e.Data);
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
    }

    public void send(string s)
    {
        ws.SendAsync(s, OnSendComplete);
    }
}

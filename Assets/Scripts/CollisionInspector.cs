using UnityEngine;

public class CollisionInspector : MonoBehaviour {

    private WS ws;
	// Use this for initialization
	void Start () {
        GameObject wsc = GameObject.Find("WSCommunication");
        ws = wsc.GetComponent<WS>();
	}
	
	// Update is called once per frame
	void Update () {
    }

    private void OnCollisionStay(Collision collision)
    {
        JSONObject output = new JSONObject();
        output.AddField("name", gameObject.name);

        JSONObject contact = new JSONObject();
        contact.AddField("normal", JSONTemplates.FromVector3(collision.contacts[0].normal));
        contact.AddField("point", JSONTemplates.FromVector3(transform.TransformVector(collision.contacts[0].point)));
        contact.AddField("separation", collision.contacts[0].separation);
        output.AddField("contact", contact);

        output.AddField("impulse", JSONTemplates.FromVector3(collision.impulse));
        output.AddField("relativeVelocity", JSONTemplates.FromVector3(collision.relativeVelocity));

        //print(output.Print());
        // Example: {"name":"bone3","contact":{"normal":{"x":0.008832605,"y":0.8679793,"z":-0.4965217},"point":{"x":-0.07428741,"y":0.1465222,"z":-0.1593797},"separation":0.008330048},"impulse":{},"relativeVelocity":{"x":-0.01717985,"y":0.01998324,"z":-0.005812378}}
        ws.send(output.Print());
    }
}

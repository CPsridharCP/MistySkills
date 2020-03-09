using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;

public class imagePuller : MonoBehaviour
{

    public RawImage img;
    public InputField InputIP;
    private string robotIP;

    private string widthRes = "320";
    private string heightRes = "240";

    private void Awake()
    {
        img = this.gameObject.GetComponent<RawImage>();
    }

    // Start is called before the first frame update
    void Start()
    {
        
    }

    public void UpdateIPAndStart()
    {
        robotIP = InputIP.text;
        StartCoroutine(pullImage());
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void switchHighRes()
    {
        widthRes = "4160";
        heightRes = "3120";
    }

    public void switchMedRes()
    {
        widthRes = "2048";
        heightRes = "1536";
    }

    public void switchLowRes()
    {
        widthRes = "320";
        heightRes = "240";
    }


    IEnumerator pullImage()
    {

        string url = "http://" + robotIP +"/api/cameras/rgb?base64=false&width=" + widthRes + "&height=" + heightRes + "&displayOnScreen=false&overwriteExisting=false";

        UnityWebRequest uwr = UnityWebRequestTexture.GetTexture(url);
        yield return uwr.SendWebRequest();

        if (uwr.isNetworkError || uwr.isHttpError)
        {
            Debug.Log(uwr.error);
            StartCoroutine(pullImage());
        }
        else
        {
            var texture = DownloadHandlerTexture.GetContent(uwr);
            img.texture = texture;
            StartCoroutine(pullImage());
        }

    }

}

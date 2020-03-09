using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
using UnityEngine.EventSystems;

public class DriveScript : MonoBehaviour
{
    public InputField InputIP;
    public InputField InputText;
    public RectTransform Arrow;
   
    public int maxDriveSpeed = 40;
    public int maxTurnSpeed = 20;

    private string robotIP = "";
    private int currentSpeed = 0;
    private int currentTurn = 0;
    private int speed = 0;
    private int turn = 0;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    public void UpdateIPAndStart()
    {
        robotIP = InputIP.text;
    }

    public void Speak()
    {
        StartCoroutine(Speak(InputText.text));
    }

    // Update is called once per frame
    void Update()
    {
        if (robotIP != "")
        {

            // Move Head On Click
            if (Input.GetButtonDown("Fire1") && EventSystem.current.currentSelectedGameObject == null)
            {
                float yaw = (UnityEngine.Input.mousePosition[0] / (float)Screen.width) * 100.0f;
                float pitch = (UnityEngine.Input.mousePosition[1] / (float)Screen.height) * 100.0f;

                yaw = yaw.Remap(0.0f, 100.0f, 75.0f, -75.0f);
                pitch = (pitch >= (float)Screen.height / 2.0f) ? pitch.Remap(50.0f, 100.0f, 0.0f, -30.0f) : pitch.Remap(0.0f, 50.0f, 23.0f, 0.0f);
                StartCoroutine(MoveHead(pitch, yaw));
                Arrow.transform.rotation = Quaternion.Euler(0, 0, yaw+42);
            }

            // Driving Code Block
            speed = ((int)UnityEngine.Input.GetAxisRaw("Vertical") != 0) ? (int)Mathf.Sign(UnityEngine.Input.GetAxisRaw("Vertical")) * maxDriveSpeed : 0;
            turn = ((int)UnityEngine.Input.GetAxisRaw("Horizontal") != 0) ? -1 * (int)Mathf.Sign(UnityEngine.Input.GetAxisRaw("Horizontal")) * maxTurnSpeed : 0;
            turn = (speed != 0 && turn != 0) ? turn : turn / 2;

            if (currentSpeed != speed || currentTurn != turn)
            {
                currentSpeed = speed;
                currentTurn = turn;
                StartCoroutine(Drive(speed, turn));
            }

            if (UnityEngine.Input.GetKeyDown("space"))
            {
                StartCoroutine(Drive(0, 0, true));
            }
        }    
    }

    IEnumerator MoveHead(float pitch, float yaw)
    {
        Debug.Log(headJson(pitch, yaw));
        var url = "http://" + robotIP + "/api/head";
        UnityWebRequest request = new UnityWebRequest(url);
        request.uploadHandler = new UploadHandlerRaw(System.Text.Encoding.UTF8.GetBytes(headJson(pitch, yaw)));
        request.downloadHandler = new DownloadHandlerBuffer();
        request.method = "POST";
        request.SetRequestHeader("Content-Type", "text/plain");
        yield return request.SendWebRequest();

        if (request.isNetworkError || request.isHttpError) Debug.Log(request.error);
        else Debug.Log("MoveHead upload complete!");
    }

    IEnumerator Drive(int linear = 0, int angular = 0, bool stop = false)
    {
        string payload = driveJson(linear, angular);
        string url = "http://" + robotIP + "/api/drive";
        if (stop)
        {
            payload = "{ \"hold\" : false}";
            url += "/stop"; 
        }
        Debug.Log(payload);
        UnityWebRequest request = new UnityWebRequest(url);
        request.uploadHandler = new UploadHandlerRaw(System.Text.Encoding.UTF8.GetBytes(payload));
        request.downloadHandler = new DownloadHandlerBuffer();
        request.method = "POST";
        request.SetRequestHeader("Content-Type", "text/plain");
        yield return request.SendWebRequest();

        if (request.isNetworkError || request.isHttpError) Debug.Log(request.error);
        else Debug.Log("Drive upload complete!");
    }

    IEnumerator Speak(string text)
    {
        Debug.Log(speakJson(text));
        string url = "http://" + robotIP + "/api/tts/speak";
        UnityWebRequest request = new UnityWebRequest(url);
        request.uploadHandler = new UploadHandlerRaw(System.Text.Encoding.UTF8.GetBytes(speakJson(text)));
        request.downloadHandler = new DownloadHandlerBuffer();
        request.method = "POST";
        request.SetRequestHeader("Content-Type", "text/plain");
        yield return request.SendWebRequest();

        if (request.isNetworkError || request.isHttpError) Debug.Log(request.error);
        else Debug.Log("Speaking upload complete!");
    }

    string headJson(float pitch, float yaw)
    {
        return "{ \"pitch\" : " + pitch.ToString() + " , \"roll\" : 0.0 , \"yaw\" : " + yaw.ToString() + " , \"duration\" : 2}";
    }

    string driveJson(int linear, int angular)
    {
        return "{ \"linearVelocity\" : " + linear.ToString() + " , \"angularVelocity\" : " + angular.ToString() + "}";
    }

    string speakJson(string text)
    {
        return "{ \"text\" : \"" + text + "\", \"flush\": null , \"utteranceId\" : null }";
    }
}

public static class ExtensionMethods
{

    public static float Remap(this float value, float from1, float to1, float from2, float to2)
    {
        return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
    }

}

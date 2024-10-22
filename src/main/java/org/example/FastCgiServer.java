package org.example;

import com.fastcgi.FCGIInterface;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class FastCgiServer {
    static Map<ResponseStatus, Integer> responseStatusesToCodes = Map.of(
            ResponseStatus.OK, 200,
            ResponseStatus.ERROR, 400,
            ResponseStatus.INVALID_REQUEST_METHOD, 405
    );
    static Map<ResponseStatus, String> responseStatusesToTexts = Map.of(
            ResponseStatus.OK, "OK",
            ResponseStatus.ERROR, "Bad Request",
            ResponseStatus.INVALID_REQUEST_METHOD, "Method Not Allowed"
    );
    static String httpResponseTemplate = """
            HTTP/2 %d %s
            Content-Type: application/json
            Content-Length: %d
                                         
            %s
            """;

    public static Response processRequest(String request) {
        String[] args = request.split("&");
        if (args.length != 3) {
            return new Response("Invalid args amount", ResponseStatus.ERROR);
        }
        Main.logger.info("got a request:" + Arrays.toString(args));

        Map<String, String> requestContent = new HashMap<>();
        for (String arg : args) {
            if (arg.split("=").length < 2) return new Response("Not all args are matched", ResponseStatus.ERROR);

            else requestContent.put(arg.split("=")[0].toLowerCase(), arg.split("=")[1]);
        }
        Main.logger.info("received args: " + requestContent);
        if (!requestContent.keySet().equals(Response.arguments))
            return new Response("Not all args are matched", ResponseStatus.ERROR);


        Main.logger.info("starts checking validation for values x:" + requestContent.get("x") + requestContent.get("y") + requestContent.get("r"));
        try {
            if (!ServerLogic.checkX(requestContent.get("x")))
                return new Response("X is not valid", ResponseStatus.ERROR);
            if (!ServerLogic.checkY(requestContent.get("y")))
                return new Response("Y is not valid", ResponseStatus.ERROR);
            if (!ServerLogic.checkR(requestContent.get("r")))
                return new Response("R is not valid", ResponseStatus.ERROR);
            return getResponseSuccess(requestContent);
        } catch (NumberFormatException e) {
            return new Response("Inputs are not numbers", ResponseStatus.ERROR);
        }

    }
    public static Response getResponseSuccess(Map<String, String> requestContent) {
        Main.logger.info("checking request success...\n\n");
        Response response = new Response(ServerLogic.checkIfInSquare(requestContent.get("x"),
                requestContent.get("y"), requestContent.get("r")) ? "success" : "miss",
                ResponseStatus.OK);
        response.setContent(requestContent);
        Main.logger.info("checked request success:" + response.message() + "\n");
        return response;
    }

    public static void sendResponse(Response response) {
        Main.logger.info("im into sendResponse\nmy response is " + response);

        int statusCode = responseStatusesToCodes.get(response.responseStatus()); // 200 400 405
        String statusText = responseStatusesToTexts.get(response.responseStatus()); // OK, Bad Request, Method Not Allowed
        String responseBody = response.toString();
        int contentLength = responseBody.getBytes().length;

        String formattedResponse = String.format(httpResponseTemplate, statusCode, statusText, contentLength, responseBody);
        Main.logger.info(formattedResponse);
        System.out.println(formattedResponse);

    }

    public static void run() {
        Main.logger.info("Server started");
        while (new FCGIInterface().FCGIaccept() >= 0) {
            long executionStart = System.nanoTime();
            String method = FCGIInterface.request.params.getProperty("REQUEST_METHOD");
            Main.logger.info(method);
            if (method.equals("GET")) {
                String request = FCGIInterface.request.params.getProperty("QUERY_STRING");

                Main.logger.info("got a request:" + request + "\n");
                Response response = processRequest(request);
                response.setTime(executionStart);
                sendResponse(response);

            } else {
                sendResponse(new Response("No such method", ResponseStatus.INVALID_REQUEST_METHOD));
                Main.logger.severe("no such request method");
                //  System.out.println("no such request method");
            }

        }
    }
}

package org.example;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public record Response(String message, ResponseStatus responseStatus) {
    public static Set<String> arguments = Set.of("x", "y", "r");
    public static Map<String, String> content =  new HashMap<>();
    public void setContent(Map<String, String> requestContent) {
        content = requestContent;
    }
    public void setTime(long executionStart){
        content.put("execution_time", String.valueOf(System.nanoTime() - executionStart));
    }

    @Override
    public String toString() {
        if (responseStatus != ResponseStatus.OK) {
            return """
                    {"error": "%s"}
                    """.formatted(message);
        }
        return """
                {"x": "%s",
                "y": "%s",
                "r": "%s",
                "success": "%s",
                "execution_time": "%s",
                "current_time": "%s"}""".formatted(content.get("x"), content.get("y"), content.get("r"),
                message, content.get("execution_time"), String.valueOf(LocalTime.now()));
    }
}

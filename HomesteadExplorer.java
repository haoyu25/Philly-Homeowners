import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.stage.Stage;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

public class HomesteadExplorer extends Application {
    @Override
    public void start(Stage primaryStage) {
        // Create main container
        BorderPane root = new BorderPane();
        root.setStyle("-fx-background-color: #f5f5f5;");

        // Create header
        HBox header = createHeader();
        root.setTop(header);

        // Create sidebar
        VBox sidebar = createSidebar();
        root.setLeft(sidebar);

        // Create main content area
        GridPane mainContent = createMainContent();
        root.setCenter(mainContent);

        // Set up the scene
        Scene scene = new Scene(root, 1200, 800);
        primaryStage.setTitle("Philly Homestead Exemption Explorer");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private HBox createHeader() {
        HBox header = new HBox(20);
        header.setStyle("-fx-background-color: #e42524; -fx-padding: 15; -fx-background-radius: 8;");
        header.setAlignment(Pos.CENTER_LEFT);

        Label title = new Label("Philly Homestead Exemption Explorer");
        title.setStyle("-fx-text-fill: white; -fx-font-size: 20; -fx-font-weight: bold;");

        HBox buttons = new HBox(10);
        Button exportBtn = new Button("Export Data");
        Button resetBtn = new Button("Reset Filters");
        
        for (Button btn : new Button[]{exportBtn, resetBtn}) {
            btn.setStyle("-fx-background-color: #e42524; -fx-text-fill: white; -fx-padding: 10 20;");
        }

        buttons.getChildren().addAll(exportBtn, resetBtn);
        header.getChildren().addAll(title, buttons);
        HBox.setHgrow(title, Priority.ALWAYS);

        return header;
    }

    private VBox createSidebar() {
        VBox sidebar = new VBox(20);
        sidebar.setStyle("-fx-background-color: white; -fx-padding: 20; -fx-background-radius: 8;");
        sidebar.setPrefWidth(300);

        // Property Characteristics
        VBox propertyGroup = createFilterGroup("Property Characteristics");
        CheckBox residential = new CheckBox("Residential Only");
        CheckBox ownerOccupied = new CheckBox("Owner Occupied");
        CheckBox noRental = new CheckBox("No Rental License");
        propertyGroup.getChildren().addAll(residential, ownerOccupied, noRental);

        // Value Range
        VBox valueGroup = createFilterGroup("Value Range");
        Slider valueSlider = new Slider(0, 1000000, 500000);
        valueSlider.setShowTickLabels(true);
        valueSlider.setShowTickMarks(true);
        valueSlider.setMajorTickUnit(100000);
        HBox valueLabels = new HBox(10);
        valueLabels.getChildren().addAll(new Label("$0"), new Label("$1M"));
        valueGroup.getChildren().addAll(valueSlider, valueLabels);

        // Demographics
        VBox demoGroup = createFilterGroup("Demographics");
        CheckBox highPoverty = new CheckBox("High Poverty Areas");
        CheckBox limitedEnglish = new CheckBox("Limited English Proficiency");
        demoGroup.getChildren().addAll(highPoverty, limitedEnglish);

        // Time Period
        VBox timeGroup = createFilterGroup("Time Period");
        ComboBox<String> timeSelect = new ComboBox<>();
        timeSelect.getItems().addAll("Last 2 Years", "Last 5 Years", "All Time");
        timeSelect.setValue("Last 2 Years");
        timeGroup.getChildren().add(timeSelect);

        sidebar.getChildren().addAll(propertyGroup, valueGroup, demoGroup, timeGroup);
        return sidebar;
    }

    private VBox createFilterGroup(String title) {
        VBox group = new VBox(10);
        Label titleLabel = new Label(title);
        titleLabel.setStyle("-fx-font-weight: bold;");
        group.getChildren().add(titleLabel);
        return group;
    }

    private GridPane createMainContent() {
        GridPane mainContent = new GridPane();
        mainContent.setHgap(20);
        mainContent.setVgap(20);
        mainContent.setPadding(new Insets(20));

        // Map Panel
        Pane mapPanel = createPanel("Interactive Map of Philadelphia Census Tracts", "#e3f9f7");
        mainContent.add(mapPanel, 0, 0, 2, 1);

        // Chart Panel
        Pane chartPanel = createPanel("Homestead Exemption Rate Distribution", "#f4aa9e");
        mainContent.add(chartPanel, 0, 1);

        // Data Panel
        Pane dataPanel = createPanel("Property Transfer Analysis", "#00ADA9");
        mainContent.add(dataPanel, 1, 1);

        return mainContent;
    }

    private Pane createPanel(String title, String color) {
        VBox panel = new VBox();
        panel.setStyle("-fx-background-color: " + color + "; -fx-background-radius: 8;");
        panel.setPrefHeight(300);
        panel.setAlignment(Pos.CENTER);
        
        Label titleLabel = new Label(title);
        titleLabel.setStyle("-fx-text-fill: white; -fx-font-size: 16;");
        panel.getChildren().add(titleLabel);
        
        return panel;
    }

    public static void main(String[] args) {
        launch(args);
    }
} 